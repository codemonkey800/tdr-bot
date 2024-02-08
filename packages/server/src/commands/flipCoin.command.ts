import { Command, Handler } from '@discord-nestjs/core'
import { Injectable, Logger } from '@nestjs/common'
import { CommandInteraction } from 'discord.js'

@Command({
  name: 'flip-coin',
  description: 'Flips a coin',
})
@Injectable()
export class FlipCoinCommand {
  private readonly logger = new Logger(FlipCoinCommand.name)

  @Handler()
  async handleFlipCoin(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return
    const result = Math.random() <= 0.5 ? 'Heads' : 'Tails'

    this.logger.log(
      [
        'flip-coin',
        `user=${interaction.user.username}`,
        `result=${result}`,
      ].join(' '),
    )

    await interaction.reply(`${result}`)
  }
}
