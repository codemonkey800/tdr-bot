import { Message } from 'discord.js'
import { injectable } from 'inversify'
import {
  AgentExecutor,
  initializeAgentExecutorWithOptions,
} from 'langchain/agents'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { SerpAPI } from 'langchain/tools'
import { Calculator } from 'langchain/tools/calculator'
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
      let sendTypingCount = 1
      const typingInterval = setInterval(async () => {
        if (sendTypingCount > 5) {
          await message.reply(
            "Sorry it's taking me longer than usual to process this message",
          )
          clearInterval(typingInterval)

          return
        }

        sendTypingCount += 1
        await message.channel.sendTyping()
      }, 11 * 1000)

      try {
        await this.sendChatMessage(
          message,
          formattedMessage,
          message.author.username,
        )
      } finally {
        clearInterval(typingInterval)
      }
    }
  }
}
