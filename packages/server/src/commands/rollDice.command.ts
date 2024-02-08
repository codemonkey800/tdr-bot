import { SlashCommandPipe } from '@discord-nestjs/common'
import {
  Command,
  Handler,
  InteractionEvent,
  Param,
  ParamType,
} from '@discord-nestjs/core'
import { Injectable, Logger } from '@nestjs/common'
import { User } from 'discord.js'
import { random } from 'lodash-es'

export class RollDiceCommandArgs {
  @Param({
    description: 'The number of sides to use for the dice roll.',
    minValue: 1,
    type: ParamType.INTEGER,
  })
  sides: number = 1
}

@Command({
  name: 'roll-dice',
  description: 'Rolls an n-sided dice',
})
@Injectable()
export class RollDiceCommand {
  private readonly logger = new Logger(RollDiceCommand.name)

  @Handler()
  handleRollDice(
    @InteractionEvent(SlashCommandPipe) options: RollDiceCommandArgs,
    @InteractionEvent('user') user: User,
  ) {
    const sides = options.sides ?? 6
    const result = random(1, sides)

    this.logger.log('Rolled dice', {
      sides,
      result,
      user: user.username,
    })

    return `Rolled a ${result} from a d${sides}`
  }
}
