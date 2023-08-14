import { REST, Routes } from 'discord.js'
import * as commands from 'src/commands'
import { getAPIToken, getClientID } from 'src/utils'

interface RegisterCommandsResponse {
  name: string
}

export async function registerCommands() {
  const token = getAPIToken()
  const rest = new REST({ version: '10' }).setToken(token)

  const commandData = Object.values(commands).map((command) =>
    command.data.toJSON(),
  )

  try {
    console.log('Registering slash commands')

    const result = (await rest.put(Routes.applicationCommands(getClientID()), {
      body: commandData,
    })) as RegisterCommandsResponse[]

    console.log(
      `Registered ${result.length} commands:`,
      result.map((command) => command.name).join(', '),
    )
  } catch (err) {
    console.error('Failed to register commands', err)
  }
}
