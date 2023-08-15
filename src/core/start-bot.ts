import { Client, Events, GatewayIntentBits } from 'discord.js'
import { getAPIToken } from 'src/utils'

import { setupCommandHandlers } from './setup-command-handlers'
import { setupEventHandlers } from './setup-event-handlers'
import { setupSchedules } from './setup-schedules'
import { addModule } from 'src/modules'

export async function startBot() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  })

  client.once(Events.ClientReady, (readyClient) => {
    addModule('discordClient', readyClient)
    setupCommandHandlers(readyClient)
    setupSchedules(readyClient)
    setupEventHandlers(readyClient)
  })

  try {
    const token = getAPIToken()
    await client.login(token)
    console.log('Started tdr-bot 🫡')
  } catch (err) {
    console.error('Failed to login to Discord client', err)
  }
}
