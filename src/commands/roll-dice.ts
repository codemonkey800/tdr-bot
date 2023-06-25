import { CacheType, Interaction, SlashCommandBuilder } from 'discord.js'
import { random } from 'lodash'

import { Command } from './types'

export const rollDice: Command = {
  name: 'roll-dice',

  data: new SlashCommandBuilder()
    .setName('roll-dice')
    .setDescription('Rolls dice')
    .addNumberOption((option) =>
      option
        .setName('sides')
        .setDescription('The number of sides to use for the dice roll.')
        .setMinValue(1),
    ),

  async execute(interaction: Interaction<CacheType>) {
    if (!interaction.isChatInputCommand()) return
    const sides = interaction.options.getNumber('sides') ?? 6
    const result = random(1, sides)
    console.log(
      [
        'roll-dice',
        `user=${interaction.user.username}`,
        `sides=${sides}`,
        `result=${result}`,
      ].join(' '),
    )
    await interaction.reply(`Rolled a ${result} from a d${sides}`)
  },
}
