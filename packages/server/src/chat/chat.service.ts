import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GptModel, MAX_TOKENS_BY_MODEL } from '@tdr-bot/shared'
import dedent from 'dedent'
import { Message } from 'discord.js'
import fs from 'fs/promises'
import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources'
import { encoding_for_model } from 'tiktoken'

import { CHAT_FUNCTIONS } from './functions'
import { getFullPrompt, KAWAII_PROMPT } from './prompts'
import { SearchService } from './search.service'

const MAX_TYPING_COUNT = 5
const TYPING_DURATION_MS = 11 * 1000

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name)

  private typingIntervalId: NodeJS.Timeout | null = null

  private typingCount = 0

  private openai = new OpenAI()

  private history: ChatCompletionMessageParam[] = []

  prompt = KAWAII_PROMPT

  model: GptModel = 'gpt-4-1106-preview'

  constructor(
    @Inject(ConfigService) private readonly config: ConfigService,
    @Inject(SearchService) private readonly search: SearchService,
  ) {}

  private async sendTyping(message: Message) {
    if (this.typingCount >= MAX_TYPING_COUNT) {
      await message.reply(
        "Sorry it's taking me longer than usual to process this message",
      )

      this.stopTyping()
      this.typingCount = 0
      return
    }

    this.typingCount += 1
    await message.channel.sendTyping()
  }

  startTyping(message: Message) {
    if (this.typingIntervalId) {
      return
    }

    this.typingIntervalId = setInterval(
      () => this.sendTyping(message),
      TYPING_DURATION_MS,
    )

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.sendTyping(message)
  }

  stopTyping() {
    if (!this.typingIntervalId) {
      return
    }

    clearInterval(this.typingIntervalId)
    this.typingIntervalId = null
    this.typingCount = 0
  }

  private get messages(): ChatCompletionMessageParam[] {
    return [
      {
        role: 'system',
        content: getFullPrompt(this.prompt),
      },
      ...this.history,
    ]
  }

  private async writeMessageHistory() {
    await fs.writeFile(
      'messages.json',
      JSON.stringify(this.messages, null, 2),
      'utf-8',
    )
  }

  private async maybeTruncateHistory() {
    const messageData = JSON.stringify(this.messages)
    const encoder = encoding_for_model(this.model)

    const tokens = encoder.encode(messageData)
    const tokenMax = MAX_TOKENS_BY_MODEL[this.model]

    this.logger.log(
      `tokens.length=${tokens.length} tokenMax=${tokenMax} tokenMax * 0.1=${
        tokenMax * 0.1
      }`,
    )

    if (tokens.length >= tokenMax * 0.1) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: this.model,
          messages: [
            ...this.history,
            {
              role: 'system',
              content:
                'Summarize the conversation up to this point in 1000 words or less.',
            },
          ],
        })

        this.history = [completion.choices[0].message]

        this.logger.log('Summarized history to:', this.history)
      } catch (err) {
        this.logger.error(
          'Unable to summarize history. Clearing it instead.',
          err,
        )
        this.history = []
      }
    }

    encoder.free()
  }

  async getChatCompletion(message: Message): Promise<string> {
    const attachments = Array.from(message.attachments.values()).filter(
      (attachment) => attachment.contentType.includes('image'),
    )

    const clientId = this.config.get<string>('DISCORD_CLIENT_ID')
    const content = message.content.replace(`<@${clientId}>`, '').trim()

    let imageDescription = ''

    if (attachments.length > 0) {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: content,
              },

              {
                type: 'image_url',
                image_url: {
                  url: attachments[0].url,
                },
              },
            ],
            name: message.id,
          },
        ],
      })

      imageDescription = completion.choices.at(0).message.content ?? ''
    }

    this.history.push({
      role: 'user',
      name: message.id,
      content,
    })

    if (imageDescription) {
      this.history.push({
        role: 'system',
        content: dedent`
          Describe the image to the user. Don't tell the user you can't see the
          image because it was calculated by a separate tool. Be as descriptive
          and use lots of emojis. The description is:

          "${imageDescription}"
        `,
      })
    }

    await this.maybeTruncateHistory()

    try {
      const completion = await this.openai.chat.completions.create({
        messages: this.messages,
        model: this.model,
        functions: CHAT_FUNCTIONS,
      })

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.writeMessageHistory()

      return completion.choices.at(0).message.content
    } catch (err) {
      this.logger.error(err)
      throw err
    }
  }
}
