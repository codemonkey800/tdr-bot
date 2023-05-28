import { CacheType, Interaction, SlashCommandBuilder } from 'discord.js'
import { injectable } from 'inversify'
import { logger } from 'src/core/logger'

import { BaseCommand } from './base-command'

@injectable()
export class FlipCoinCommand extends BaseCommand {
  protected command = new SlashCommandBuilder()
    .setName('flip-coin')
    .setDescription('Flips a coin')

  async execute(interaction: Interaction<CacheType>): Promise<void> {
    if (!interaction.isChatInputCommand()) return
    const result = Math.random() <= 0.5 ? 'Heads' : 'Tails'
    logger.log(
      [
        'flip-coin',
        `user=${interaction.user.username}`,
        `result=${result}`,
      ].join(' '),
    )
    await interaction.reply(`${result}`)
  }
}
