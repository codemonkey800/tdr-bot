import { Client, Events, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'
import { sample } from 'lodash-es'

import { customQuotes } from './customQuotes'
import { Quote } from './types'
import { EnabledZenKeywords, getQuotesByKeyword } from './zenQuotesAPI'

dotenv.config()

function getAPIToken(): string {
  const apiToken = process.env.DISCORD_API_TOKEN

  if (!apiToken) {
    throw new Error('DISCORD_API_TOKEN not defined')
  }

  return apiToken
}

async function getQuotes(): Promise<Quote[]> {
  if (Math.random() <= 0.3) {
    return customQuotes
  }

  const keyword = sample(Object.values(EnabledZenKeywords))
  return getQuotesByKeyword(keyword as EnabledZenKeywords)
}

async function main() {
  const quotes = await getQuotes()
  const client = new Client({ intents: [GatewayIntentBits.Guilds] })

  client.once(Events.ClientReady, async (c) => {
    const channels = c.guilds.cache.flatMap((guild) =>
      guild.channels.cache.filter((channel) => channel.name === 'irl'),
    )

    await Promise.allSettled(
      channels.map(async (channel) => {
        if (channel.isTextBased()) {
          const quote = sample(quotes)
          if (quote) {
            await channel.send(`> "${quote.quote}"\n> - ${quote.author}`)
          }
        }
      }),
    )

    client.destroy()
  })

  await client.login(getAPIToken())
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
