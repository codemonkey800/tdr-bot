import { CacheType, Interaction } from 'discord.js'

export interface CommandBuilder {
  name: string
  toJSON(): object
}

export interface Command {
  name: string
  data: CommandBuilder
  execute(interaction: Interaction<CacheType>): Promise<void>
}
