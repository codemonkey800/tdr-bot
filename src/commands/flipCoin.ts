import { CacheType, Interaction, SlashCommandBuilder } from 'discord.js'

export const flipCoinCommand = {
  data: new SlashCommandBuilder()
    .setName('flip-coin')
    .setDescription('Flips a coin'),

  async execute(interaction: Interaction<CacheType>) {
    if (!interaction.isChatInputCommand()) return
    const result = Math.random() <= 0.5 ? 'Heads' : 'Tails'
    await interaction.reply(`${result}`)
  },
}
