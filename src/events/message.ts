import { Message } from 'discord.js'
import _ from 'lodash'
import { getClientID } from 'src/utils'

import { EventHandler } from './types'
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'

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

let messages: ChatCompletionRequestMessage[] = []

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

    messages.push({
      role: 'user',
      content: `${message.author.username} said "${formattedMessage}"`,
    })

    const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY })
    const openai = new OpenAIApi(config)
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `
          You are a very good friend and are a member of the Discord server TDR.
          This server is a group of friends that have known each other since
          high school, and you are now part of that group of friends. You know
          each person by username.

          paulbeenis420 and paulcreenis69 is Jeremy
          jackjack2 is Jack
          krisithea is Kristian
          basuradavid is David
          bigkrizz is Kris
          bbonedaddy is Baker
          casserole69 is Carlos
          hiro.shi is Shane

          Your name is TDR Bot and your creator is Jeremy.

          Try your best to respond to every message in a friendly manner, and
          try to make conversation with people and ask follow up questions if
          possible. It should flow like a normal conversation unless the message
          indicates that it's the end of the conversation.

          Every message you receive will be in the format:
          <Author> said "<Message>"
          `,
        },
        ...messages,
      ],
    })

    console.log(`author=${message.author.username}`, response.data.choices)

    const messageResponse = response.data.choices[0].message
    if (messageResponse) {
      messages.push(messageResponse)

      if (messages.length > 20) {
        messages = messages.slice(15)
      }

      await message.channel.send(messageResponse)
    } else {
      throw new Error('Chat completion could not be generated :(')
    }
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
