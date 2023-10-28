import { Message } from 'discord.js'
import _ from 'lodash'
import { getClientID, getSearchResultSnippets } from 'src/utils'

import { EventHandler } from './types'
import { ChatCompletionFunctions, Configuration, OpenAIApi } from 'openai'
import { getModule } from 'src/modules'

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
  const serverState = getModule('state')

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
    const functions: ChatCompletionFunctions[] = [
      {
        name: 'search',
        description: 'Requests search results fromg Google Search API',
        parameters: {
          properties: {
            query: {
              description: 'Query string to pass to Google search API',
              type: 'string',
            },
          },
          required: ['query'],
          type: 'object',
        },
      },
    ]
    const response = await openai.createChatCompletion({
      functions,
      model: 'gpt-4',
      messages: serverState.history,
    })

    console.log(
      `Received choices for author=${message.author.username}`,
      response.data.choices,
    )

    const messageResponse = response.data.choices[0].message
    if (messageResponse) {
      serverState.addMessage(messageResponse)

      if (messageResponse.function_call?.name === 'search') {
        const args = JSON.parse(messageResponse.function_call.arguments ?? '{}')
        console.log(`searching on google with query: "${args.query}"`)
        const snippets = await getSearchResultSnippets(args.query)

        if (snippets) {
          serverState.addMessage({
            role: 'function',
            name: 'search',
            content: snippets,
          })

          const nextResponse = await openai.createChatCompletion({
            functions,
            model: 'gpt-4',
            messages: serverState.history,
          })

          const nextMessageResponse = nextResponse.data.choices[0].message
          if (nextMessageResponse) {
            await message.channel.send(nextMessageResponse)
          }
        } else {
          console.log(
            `Unable to load knowledge graph for query="${args.query}"`,
          )

          serverState.addMessage({
            role: 'system',
            content:
              'You were unable to find results for the previous query. Let the user know that you could not find information about it.',
          })

          const nextResponse = await openai.createChatCompletion({
            functions,
            model: 'gpt-4',
            messages: serverState.history,
          })

          const nextMessageResponse = nextResponse.data.choices[0].message
          if (nextMessageResponse) {
            await message.channel.send(nextMessageResponse)
          }
        }
      } else {
        await message.channel.send(messageResponse)
      }
    } else {
      throw new Error('Chat completion could not be generated :(')
    }
    clearInterval(typingInterval)
    console.log('Response sent successfully')
  } catch (err) {
    serverState.messages.pop()

    console.error('Error resolving chat message', err)

    await message.reply(
      `An error occurred for this message\n\`\`\`\n${String(
        err,
      )}\n\`\`\`\nTry clearing the chat history on https://tdr-bot.fly.dev/history\nCheck the logs at https://fly.io/apps/tdr-bot/monitoring`,
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
