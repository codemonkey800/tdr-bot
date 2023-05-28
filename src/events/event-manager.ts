/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Client } from 'discord.js'
import { injectable } from 'inversify'
import { logger } from 'src/core/logger'

import { EventRecurrence } from './base-event'
import { HandleConversationOnMessageEvent } from './handle-conversation'
import { SendWarOnWarMessageEvent } from './send-war-on-war-message'

@injectable()
export class EventManager {
  constructor(
    private readonly sendWarOnWarMessage: SendWarOnWarMessageEvent,
    private readonly handleConversationOnMessage: HandleConversationOnMessageEvent,
    private readonly client: Client<true>,
  ) {}

  listenToEvents() {
    const events = [this.sendWarOnWarMessage, this.handleConversationOnMessage]
    logger.log('Setting up listeners for events:')

    for (const event of events) {
      const handleEvent = async (...args: any[]) => {
        try {
          // @ts-ignore
          await event.handleEvent(...args)
        } catch (err) {
          logger.error(`Error running handler for event ${event.name}`, err)
        }
      }

      if (event.recurrence === EventRecurrence.On) {
        this.client.on(event.event, handleEvent)
      } else {
        this.client.once(event.event, handleEvent)
      }

      logger.log(
        '  ',
        event.name,
        `event=${event.event}`,
        `recurrence=${event.recurrence}`,
      )
    }
  }
}
