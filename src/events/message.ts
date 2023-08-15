import { Message } from 'discord.js'
import _ from 'lodash'
import { getClientID } from 'src/utils'

import { EventHandler } from './types'
import { Configuration, OpenAIApi } from 'openai'
import { getServerState } from 'src/state'

async function handleWarMessage(message: Message<boolean>) {
  const clientId = getClientID()

  if (
    message.content.toLowerCase().split(' ').includes('war') &&
    message.author.id !== clientId
  ) {
    if (_.random(1, 420) === 420) {
      await message.reply('war never changes')
    }

    await message.reply('war')
    return true
  }

  return false
}

async function handleChatMessage(message: Message<boolean>) {
  const clientId = getClientID()
  const serverState = getServerState()

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

    serverState.addMessage({
      role: 'user',
      content: `${message.author.username} said "${formattedMessage}"`,
    })

    const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY })
    const openai = new OpenAIApi(config)
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: serverState.history,
    })

    console.log(`author=${message.author.username}`, response.data.choices)

    const messageResponse = response.data.choices[0].message
    if (messageResponse) {
      serverState.addMessage(messageResponse)
      await message.channel.send(messageResponse)
    } else {
      throw new Error('Chat completion could not be generated :(')
    }
    clearInterval(typingInterval)
    console.log('Response sent successfully')
  } catch (err) {
    serverState.messages.pop()

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
