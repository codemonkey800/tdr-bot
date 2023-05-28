/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Client, ClientEvents } from 'discord.js'
import { injectable } from 'inversify'
import { partition } from 'lodash'
import { logger } from 'src/core/logger'

import { BaseEvent, EventRecurrence } from './base-event'
import { HandleConversationOnMessageEvent } from './handle-conversation'
import { SendWarOnWarMessageEvent } from './send-war-on-war-message'

type ListenerMap = Map<string, BaseEvent<keyof ClientEvents>>

@injectable()
export class EventManager {
  listeners = new Map<keyof ClientEvents, ListenerMap>()

  constructor(
    private readonly sendWarOnWarMessage: SendWarOnWarMessageEvent,
    private readonly handleConversationOnMessage: HandleConversationOnMessageEvent,
    private readonly client: Client<true>,
  ) {}

  private logRespondToEvents(event: keyof ClientEvents) {
    const listeners = this.listeners.get(event)?.values()
    if (!listeners) {
      return
    }

    logger.log(
      `Responding to event event=${event} listeners=${[...listeners]
        .map((e) => e.name)
        .join(',')}`,
    )
  }

  private initEvent(event: keyof ClientEvents) {
    this.client.on(event, async (...args: any[]) => {
      const listeners = [...(this.listeners.get(event)?.values() ?? [])]
      if (listeners.length === 0) {
        return
      }

      this.logRespondToEvents(event)

      const [recurringEvents, runOnceEvents] = partition(
        listeners,
        (e) => e.recurrence === EventRecurrence.On,
      )

      await Promise.allSettled(
        recurringEvents.map((e) =>
          e.handleEvent(
            // @ts-ignore
            ...args,
          ),
        ),
      )

      await Promise.allSettled(
        runOnceEvents.map((e) => {
          const nextList = this.listeners.get(event)
          if (nextList) {
            nextList.delete(e.name)
            this.listeners.set(event, nextList)
          }

          return e.handleEvent(
            // @ts-ignore
            ...args,
          )
        }),
      )
    })
  }

  listenToEvents() {
    const events = [this.sendWarOnWarMessage, this.handleConversationOnMessage]
    logger.log('Setting up listeners for events:')

    for (const event of events) {
      const listeners =
        this.listeners.get(event.event) ?? (new Map() as ListenerMap)
      const shouldInitEvent = listeners.size === 0

      listeners.set(event.name, event)
      this.listeners.set(event.event, listeners)

      if (shouldInitEvent) {
        this.initEvent(event.event)
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
