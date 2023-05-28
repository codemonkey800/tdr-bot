import { ClientEvents } from 'discord.js'

export enum EventRecurrence {
  Once = 'once',
  On = 'on',
}

export interface BaseEvent<K extends keyof ClientEvents> {
  name: string
  event: K
  recurrence: EventRecurrence
  handleEvent(...args: ClientEvents[K]): void
}
