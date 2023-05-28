import { injectable } from 'inversify'

import { BaseCommand } from './base-command'
import { CrumbleCookiesCommand } from './crumbl-cookies'
import { FlipCoinCommand } from './flip-coin'
import { RollDiceCommand } from './roll-dice'

@injectable()
export class AllCommands {
  constructor(
    private readonly crumblCookies: CrumbleCookiesCommand,
    private readonly flipCoin: FlipCoinCommand,
    private readonly rollDice: RollDiceCommand,
  ) {}

  get commands(): BaseCommand[] {
    return [this.crumblCookies, this.flipCoin, this.rollDice]
  }
}
