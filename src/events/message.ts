import { Message } from 'discord.js'
import {
  AgentExecutor,
  initializeAgentExecutorWithOptions,
} from 'langchain/agents'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { SerpAPI } from 'langchain/tools'
import { Calculator } from 'langchain/tools/calculator'
import { random } from 'lodash'
import { getClientID } from 'src/utils'

import { EventHandler } from './types'

async function handleWarMessage(message: Message<boolean>) {
  const clientId = getClientID()

  if (
    message.content.toLowerCase().split(' ').includes('war') &&
    message.author.id !== clientId
  ) {
    if (random(1, 420) === 420) {
      await message.reply('war never changes')
    }

    await message.reply('war')
    return true
  }

  return false
}

let cachedExecutor: AgentExecutor | undefined
let count = 0

async function maybeInitExecutor(): Promise<AgentExecutor> {
  if (cachedExecutor && count < 69) {
    count += 1
    return cachedExecutor
  }

  if (count === 69) {
    console.log('Recreating executor to clear memory')
  }

  count = 0

  const model = new ChatOpenAI({ temperature: 0 })
  const tools = [
    new SerpAPI(process.env.SERP_API_KEY, {
      hl: 'en',
      gl: 'us',
    }),
    new Calculator(),
  ]

  console.log('Creating executor...')
  cachedExecutor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: 'chat-conversational-react-description',
  })
  console.log('Executor created!')

  return cachedExecutor
}

async function handleChatMessage(message: Message<boolean>) {
  const clientId = getClientID()

  if (
    // Is own message
    message.author.id === clientId ||
    // Is not mentioned in message
    !message.mentions.users.has(clientId)
  ) {
    return false
  }

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
    const formattedMessage = message.mentions.users.reduce(
      (msg, user) => msg.replaceAll(`<@${user.id}>`, user.username),
      message.content,
    )

    console.log(`Generating completion for message: "${formattedMessage}"`)

    const executor = await maybeInitExecutor()
    const result = await executor.call({
      input: `${message.author.username} said "${formattedMessage}"`,
    })
    const response = result.output as string

    await message.channel.send(response)
    clearInterval(typingInterval)
    console.log('Response sent successfully')
  } catch (err) {
    console.error('Error resolving chat message', err)
    await message.reply(
      `An error occurred for this message\n\`\`\`\n${String(err)}\n\`\`\``,
    )
    clearInterval(typingInterval)

    return false
  }

  return true
}

async function handleProgMessage(message: Message<boolean>) {
  const clientId = getClientID()

  if (
    message.content.toLowerCase().split(' ').includes('prog') &&
    message.author.id !== clientId
  ) {
    await message.reply('prog')
    return true
  }

  return false
}

const handlers = [handleWarMessage, handleProgMessage, handleChatMessage]

export const messageHandler: EventHandler<'messageCreate'> = {
  event: 'messageCreate',

  async handler(message) {
    for (const handler of handlers) {
      // eslint-disable-next-line no-await-in-loop
      if (await handler(message)) {
        return
      }
    }
  },
}
