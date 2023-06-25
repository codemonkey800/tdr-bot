import { CacheType, Interaction, SlashCommandBuilder } from 'discord.js'
import { getWeeklyCookiesMessage } from 'src/apis/crumbl'

import { Command } from './types'

export const crumblCookies: Command = {
  name: 'crumbl-cookies',

  data: new SlashCommandBuilder()
    .setName('crumbl-cookies')
    .setDescription('Gets the weekly crumbl cookies as a simple list')
    .addBooleanOption((option) =>
      option
        .setName('show-details')
        .setDescription('Show images for each cookie.'),
    ),

  async execute(interaction: Interaction<CacheType>) {
    if (!interaction.isChatInputCommand()) return

    console.log(
      ['crumbl-cookies', `user=${interaction.user.username}`].join(' '),
    )

    const showEmbeds = interaction.options.getBoolean('show-details') ?? true
    await interaction.reply(await getWeeklyCookiesMessage({ showEmbeds }))
  },
}
