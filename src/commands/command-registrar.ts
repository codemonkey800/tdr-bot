import { REST, Routes } from 'discord.js'
import { injectable } from 'inversify'
import { logger } from 'src/core/logger'
import { getAPIToken, getClientID } from 'src/core/utils'

import { AllCommands } from './all-commands'
import { BaseCommand } from './base-command'

interface RegisterCommandsResponse {
  name: string
}

@injectable()
export class CommandRegistrar {
  private commands: BaseCommand[]

  constructor(readonly allCommands: AllCommands) {
    this.commands = allCommands.commands
  }

  async registerCommands() {
    const token = getAPIToken()
    const rest = new REST({ version: '10' }).setToken(token)

    const commandData = this.commands.map((command) => command.toJSON())

    try {
      logger.log('Registering slash commands')

      const result = (await rest.put(
        Routes.applicationCommands(getClientID()),
        {
          body: commandData,
        },
      )) as RegisterCommandsResponse[]

      logger.log(
        `Registered ${result.length} commands:`,
        result.map((command) => command.name).join(', '),
      )
    } catch (err) {
      logger.error('Failed to register commands', err)
    }
  }
}
