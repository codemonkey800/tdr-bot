import { CacheType, Interaction, SlashCommandBuilder } from 'discord.js'
import { logger } from 'src/logger'

export const flipCoinCommand = {
  data: new SlashCommandBuilder()
    .setName('flip-coin')
    .setDescription('Flips a coin'),

  async execute(interaction: Interaction<CacheType>) {
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
  },
}
