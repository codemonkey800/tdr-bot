import { CacheType, Interaction, SlashCommandBuilder } from 'discord.js'
import { random } from 'lodash-es'

export const rollDiceCommand = {
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
    const roll = random(1, sides)
    await interaction.reply(`Rolled a ${roll}`)
  },
}
