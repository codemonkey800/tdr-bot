import { CacheType, Interaction } from 'discord.js'
import { injectable } from 'inversify'

export interface CommandBuilder {
  name: string
  toJSON(): object
}

@injectable()
export abstract class BaseCommand {
  protected abstract command: CommandBuilder
  abstract execute(interaction: Interaction<CacheType>): Promise<void>

  get name() {
    return this.command.name
  }

  toJSON() {
    return this.command.toJSON()
  }
}
