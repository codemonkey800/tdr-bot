import { Client, Events } from 'discord.js'

import { flipCoinCommand } from './flipCoin'
import { rollDiceCommand } from './rollDice'

export const commands = [rollDiceCommand, flipCoinCommand] as const

const commandMap = new Map(
  commands.map((command) => [command.data.name, command]),
)

export function setupCommandHandlers(client: Client<boolean>) {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const command = commandMap.get(interaction.commandName)
    await command?.execute(interaction)
  })
}
