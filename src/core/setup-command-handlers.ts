import { Client, Events } from 'discord.js'
import * as commands from 'src/commands'

export function setupCommandHandlers(client: Client<boolean>) {
  const allCommands = Object.values(commands)
  const commandMap = new Map(
    allCommands.map((command) => [command.name, command]),
  )

  console.log('Setting up following commands:')
  allCommands.forEach((command) => console.log('  ', command.name))

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const command = commandMap.get(interaction.commandName)
    try {
      await command?.execute(interaction)
    } catch (err) {
      console.error(`Failed to execute command "${interaction.commandName}"`)
      console.error(err)
    }
  })
}
