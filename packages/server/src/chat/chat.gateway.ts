import { InjectDiscordClient, On } from '@discord-nestjs/core'
import { Injectable, Logger, UseGuards } from '@nestjs/common'
import dedent from 'dedent'
import { Client, Message } from 'discord.js'

import { getErrorMessage } from 'src/utils/error'
import { splitMessage } from 'src/utils/string'

import { MessageFromUserGuard, MessageMentioningBotGuard } from './chat.guards'
import { ChatService } from './chat.service'
import { MESSAGE_SEPARATOR } from './prompts'

@Injectable()
export class ChatGateway {
  private readonly logger = new Logger(ChatGateway.name)

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly chatService: ChatService,
  ) {}

  @On('messageCreate')
  @UseGuards(MessageFromUserGuard)
  @UseGuards(MessageMentioningBotGuard)
  async onMessage(message: Message) {
    this.chatService.startTyping(message)

    try {
      const response = await this.chatService.getChatCompletion(message)

      if (response) {
        // Fallback to splitMessage just in case ChatGPT decides to not generate
        // the separator.
        const messages = response.includes(MESSAGE_SEPARATOR)
          ? response.split(MESSAGE_SEPARATOR)
          : splitMessage(response)

        for (const m of messages) {
          // eslint-disable-next-line no-await-in-loop
          await message.reply(m)
        }
      } else {
        await message.reply(
          "Sorry I couldn't think of a response to your message <:Sadge:781403152258826281>",
        )
      }

      this.chatService.stopTyping()
    } catch (err) {
      this.logger.error('Error processing message', err)

      await message.reply(dedent`
        An error occurred for this message:

        \`\`\`
        ${getErrorMessage(err)}
        \`\`\`

        Try clearing the chat history on https://tdr-bot.fly.dev/history\nCheck the logs at https://fly.io/apps/tdr-bot/monitoring
      `)
      this.chatService.stopTyping()
    }
  }
}
