import { Client, Events } from 'discord.js'
import { injectable } from 'inversify'
import { logger } from 'src/core/logger'

import { AllCommands } from './all-commands'
import { BaseCommand } from './base-command'

@injectable()
export class CommandSetup {
  private commands: BaseCommand[]

  constructor(
    readonly allCommands: AllCommands,
    private readonly client: Client,
  ) {
    this.commands = allCommands.commands
  }

  setupCommandHandlers() {
    const commandMap = new Map(
      this.commands.map((command) => [command.name, command]),
    )

    logger.log('Setting up following commands:')
    this.commands.forEach((command) => logger.log('  ', command.name))

    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return

      const command = commandMap.get(interaction.commandName)
      try {
        await command?.execute(interaction)
      } catch (err) {
        logger.error(`Failed to execute command "${interaction.commandName}"`)
        logger.error(err)
      }
    })
  }
}
