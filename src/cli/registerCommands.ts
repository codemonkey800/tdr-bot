import { REST, Routes } from 'discord.js'
import { commands } from 'src/commands'
import { logger } from 'src/logger'
import { getAPIToken, getClientID } from 'src/utils'

interface RegisterCommandsResponse {
  length: number
}

export async function registerCommands() {
  const token = getAPIToken()
  const rest = new REST({ version: '10' }).setToken(token)

  const commandData = commands.map((command) => command.data.toJSON())

  try {
    logger.log('Registering slash commands')

    const result = (await rest.put(Routes.applicationCommands(getClientID()), {
      body: commandData,
    })) as RegisterCommandsResponse

    logger.log(`Registered ${result.length} commands:`)
    commandData.forEach((command) => logger.log(`  ${command.name}`))
  } catch (err) {
    logger.error('Failed to register commands', err)
  }
}
