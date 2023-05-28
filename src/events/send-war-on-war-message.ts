import { Client, Message } from 'discord.js'
import { injectable } from 'inversify'
import { random } from 'lodash'
import { getClientID } from 'src/core/utils'

import { BaseEvent, EventRecurrence } from './base-event'

@injectable()
export class SendWarOnWarMessageEvent extends BaseEvent<'messageCreate'> {
  name = 'send-war-on-war-message'

  event = 'messageCreate' as const

  recurrence = EventRecurrence.On

  constructor(readonly discordClient: Client<true>) {
    super(discordClient)
  }

  async handleEvent(message: Message<boolean>) {
    const clientId = getClientID()

    if (
      !message.content.toLowerCase().split(' ').includes('war') ||
      message.author.id === clientId
    ) {
      return
    }

    if (random(1, 420) === 420) {
      await message.reply('war never changes')
    }

    await message.reply('war')
  }
}
