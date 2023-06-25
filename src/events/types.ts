import { Awaitable, ClientEvents } from 'discord.js'

export interface EventHandler<K extends keyof ClientEvents> {
  event: K
  handler(...args: ClientEvents[K]): Awaitable<void>
}
