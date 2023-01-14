import { Client, Events, GatewayIntentBits } from 'discord.js'
import { getWeeklyCookiesMessage } from 'src/apis/crumbl'
import { logger } from 'src/logger'
import { getAPIToken } from 'src/utils'

export async function postWeeklyCookies() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] })

  client.once(Events.ClientReady, async (c) => {
    const channels = c.guilds.cache.flatMap((guild) =>
      guild.channels.cache.filter((channel) => channel.name === 'food'),
    )

    await Promise.allSettled(
      channels.map(async (channel) => {
        if (!channel.isTextBased()) {
          return
        }

        await channel.send(await getWeeklyCookiesMessage({ showEmbeds: true }))
      }),
    )

    client.destroy()
  })

  try {
    const token = getAPIToken()
    await client.login(token)
    logger.log('Logged in to Discord')
  } catch (err) {
    logger.error('Failed to login to Discord client', err)
  }
}
