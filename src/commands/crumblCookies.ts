import { CacheType, Interaction, SlashCommandBuilder } from 'discord.js'
import { getWeeklyCookiesMessage } from 'src/apis/crumbl'
import { logger } from 'src/logger'

export const crumblCookiesCommand = {
  data: new SlashCommandBuilder()
    .setName('crumbl-cookies')
    .setDescription('Gets the weekly crumbl cookies')
    .addBooleanOption((option) =>
      option
        .setName('show-details')
        .setDescription('Show images for each cookie.'),
    ),

  async execute(interaction: Interaction<CacheType>) {
    if (!interaction.isChatInputCommand()) return
    logger.log(
      ['crumbl-cookies', `user=${interaction.user.username}`].join(' '),
    )

    const showEmbeds = interaction.options.getBoolean('show-details') ?? false
    await interaction.reply(await getWeeklyCookiesMessage({ showEmbeds }))
  },
}
