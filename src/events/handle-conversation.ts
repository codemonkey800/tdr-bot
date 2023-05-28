import { EmbedBuilder, Message } from 'discord.js'
import { injectable } from 'inversify'
import { OpenAI, PromptTemplate } from 'langchain'
import {
  AgentExecutor,
  initializeAgentExecutorWithOptions,
} from 'langchain/agents'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { SerpAPI } from 'langchain/tools'
import { Calculator } from 'langchain/tools/calculator'
import { Configuration, OpenAIApi } from 'openai'
import { logger } from 'src/core/logger'
import { getClientID } from 'src/core/utils'

import { BaseEvent, EventRecurrence } from './base-event'

@injectable()
export class HandleConversationOnMessageEvent
  implements BaseEvent<'messageCreate'>
{
  name = 'handle-conversation-on-message'

  event = 'messageCreate' as const

  recurrence = EventRecurrence.On

  private executor?: AgentExecutor

  async maybeInitExecutor() {
    if (this.executor) {
      return
    }

    const model = new ChatOpenAI({ temperature: 0 })
    const tools = [
      new SerpAPI(process.env.SERPAPI_API_KEY, {
        hl: 'en',
        gl: 'us',
      }),
      new Calculator(),
    ]

    logger.log('Creating executor...')
    this.executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: 'chat-conversational-react-description',
    })
    logger.log('Executor created!')
  }

  private async getGenerateImageDescription(
    message: string,
  ): Promise<string | null> {
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
      imageDescription: 'description of image to generate',
      isGenerating: 'whether to generate image or not',
    })
    const instructions = parser.getFormatInstructions()

    const prompt = new PromptTemplate({
      template:
        'Return "yes" or "no" if the following message is asking to generate an image.\nStore it in JSON with the properties "imageDescription" for the image description and "isGenerating" that is "yes" or "no" if the image is generating or not.\nThe message is defined below:\n{message}',
      inputVariables: ['message'],
      partialVariables: {
        format_instructions: instructions,
      },
    })

    const model = new OpenAI({ temperature: 0 })
    const input = await prompt.format({ message })
    const response = await model.call(input)

    const { imageDescription, isGenerating } = await parser.parse(response)
    if (isGenerating === 'yes') {
      return imageDescription
    }

    return null
  }

  private async sendImageMessage(
    message: Message<boolean>,
    description: string,
  ) {
    logger.log(`Generating image for "${description}"...`)

    const config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY as string,
    })
    const api = new OpenAIApi(config)

    let imageUrl: string | undefined

    try {
      const { data } = await api.createImage({
        prompt: description,
        n: 1,
        size: '512x512',
      })

      imageUrl = data.data[0]?.url
    } catch (err) {
      logger.error('Unable to generate image', err)
    }

    if (!imageUrl) {
      await message.channel.send(
        `Unfortunately, I could not generate an image for "${description}"`,
      )
      return
    }

    await message.channel.send({
      embeds: [new EmbedBuilder().setTitle(description).setImage(imageUrl)],
    })
  }

  private async sendChatMessage(
    message: Message<boolean>,
    formattedMessage: string,
    author: string,
  ) {
    if (!this.executor) {
      return
    }

    logger.log(`Calling executor with message: "${formattedMessage}"`)

    const result = await this.executor.call({
      input: `${author} said "${formattedMessage}"`,
    })
    const response = result.output as string

    logger.log(`Responding with message: "${response}"`)
    await message.channel.send(response)
  }

  async handleEvent(message: Message<boolean>) {
    const clientId = getClientID()

    // TODO refactor logic to not require checking messages for other events
    if (
      message.content.toLowerCase().split(' ').includes('war') ||
      // Is own message
      message.author.id === clientId ||
      // Is not mentioned in message
      !message.mentions.users.has(clientId)
    ) {
      return
    }

    await this.maybeInitExecutor()
    if (this.executor) {
      const formattedMessage = message.mentions.users.reduce(
        (msg, user) => msg.replaceAll(`<@${user.id}>`, user.username),
        message.content,
      )

      await message.channel.sendTyping()
      const typingInterval = setInterval(
        () => message.channel.sendTyping(),
        11 * 1000,
      )

      const imageDescription = await this.getGenerateImageDescription(
        formattedMessage,
      )

      try {
        if (imageDescription) {
          await this.sendImageMessage(message, imageDescription)
        } else {
          await this.sendChatMessage(
            message,
            formattedMessage,
            message.author.username,
          )
        }
      } finally {
        clearInterval(typingInterval)
      }
    }
  }
}
