import { Client, Events } from 'discord.js'
import { logger } from 'src/logger'

import { crumblCookiesCommand } from './crumblCookies'
import { flipCoinCommand } from './flipCoin'
import { rollDiceCommand } from './rollDice'

export const commands = [
  rollDiceCommand,
  flipCoinCommand,
  crumblCookiesCommand,
] as const

const commandMap = new Map(
  commands.map((command) => [command.data.name, command]),
)

export function setupCommandHandlers(client: Client<boolean>) {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const command = commandMap.get(interaction.commandName)
    try {
      await command?.execute(interaction)
    } catch (err) {
      logger.error(`Failed to execute command "${interaction.commandName}"`)
    }
  })
}
