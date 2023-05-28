import { injectable } from 'inversify'
import { logger } from 'src/core/logger'

import { SendWarOnWarMessageEvent } from './send-war-on-war-message'

@injectable()
export class EventManager {
  constructor(private readonly sendWarOnWarMessage: SendWarOnWarMessageEvent) {}

  listenToEvents() {
    const events = [this.sendWarOnWarMessage]
    logger.log('Setting up listeners for events:')

    for (const event of events) {
      event.listen()
      logger.log(
        '  ',
        event.name,
        `event=${event.event}`,
        `recurrence=${event.recurrence}`,
      )
    }
  }
}
