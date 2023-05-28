import { Client, ClientEvents } from 'discord.js'
import { injectable } from 'inversify'

export enum EventRecurrence {
  Once = 'once',
  On = 'on',
}

@injectable()
export abstract class BaseEvent<K extends keyof ClientEvents> {
  abstract name: string

  abstract event: K

  protected abstract recurrence: EventRecurrence

  protected abstract handleEvent(...args: ClientEvents[K]): void

  constructor(private readonly client: Client<boolean>) {}

  listen() {
    const handler = this.handleEvent.bind(this)

    if (this.recurrence === EventRecurrence.Once) {
      this.client.once(this.event, handler)
      return
    }

    this.client.on(this.event, this.handleEvent.bind(this))
  }
}
