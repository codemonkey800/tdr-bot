import { ReflectMetadataProvider } from '@discord-nestjs/core'
import { Module } from '@nestjs/common'

import { FlipCoinCommand } from './flipCoin.command'
import { RollDiceCommand } from './rollDice.command'

@Module({
  providers: [FlipCoinCommand, ReflectMetadataProvider, RollDiceCommand],
})
export class CommandsModule {}
