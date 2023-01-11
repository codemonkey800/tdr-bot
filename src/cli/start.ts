import { Client, Events, GatewayIntentBits } from 'discord.js'
import { setupCommandHandlers } from 'src/commands'
import { getAPIToken } from 'src/utils'

export async function start() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] })
  const token = getAPIToken()

  client.once(Events.ClientReady, () => {
    setupCommandHandlers(client)
  })

  await client.login(token)
}
