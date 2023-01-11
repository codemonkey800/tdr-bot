import { Client, Events, GatewayIntentBits } from 'discord.js'
import { setupCommandHandlers } from 'src/commands'
import { logger } from 'src/logger'
import { getAPIToken } from 'src/utils'

export async function start() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] })
  const token = getAPIToken()

  client.once(Events.ClientReady, () => {
    setupCommandHandlers(client)
  })

  try {
    await client.login(token)
    logger.log('Started tdr-bot!!')
  } catch (err) {
    logger.error('Failed to login to Discord client', err)
  }
}
