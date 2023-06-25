import { SlashCommandBuilder } from 'discord.js'

import { Command } from './types'

export const flipCoin: Command = {
  name: 'flip-coin',

  data: new SlashCommandBuilder()
    .setName('flip-coin')
    .setDescription('Flips a coin'),

  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return
    const result = Math.random() <= 0.5 ? 'Heads' : 'Tails'
    console.log(
      [
        'flip-coin',
        `user=${interaction.user.username}`,
        `result=${result}`,
      ].join(' '),
    )
    await interaction.reply(`${result}`)
  },
}
