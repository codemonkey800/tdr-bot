import { CacheType, Interaction, SlashCommandBuilder } from 'discord.js'
import { injectable } from 'inversify'
import { getWeeklyCookiesMessage } from 'src/apis/crumbl'
import { logger } from 'src/core/logger'

import { BaseCommand } from './base-command'

@injectable()
export class CrumbleCookiesCommand extends BaseCommand {
  protected command = new SlashCommandBuilder()
    .setName('crumbl-cookies')
    .setDescription('Gets the weekly crumbl cookies as a simple list')
    .addBooleanOption((option) =>
      option
        .setName('show-details')
        .setDescription('Show images for each cookie.'),
    )

  async execute(interaction: Interaction<CacheType>): Promise<void> {
    if (!interaction.isChatInputCommand()) return

    logger.log(
      ['crumbl-cookies', `user=${interaction.user.username}`].join(' '),
    )

    const showEmbeds = interaction.options.getBoolean('show-details') ?? true
    await interaction.reply(await getWeeklyCookiesMessage({ showEmbeds }))
  }
}
