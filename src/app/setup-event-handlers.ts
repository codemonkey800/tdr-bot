import { Client } from 'discord.js'
import * as eventHandlers from 'src/events'

export function setupEventHandlers(client: Client<boolean>) {
  console.log('Setting up event handlers for events:')
  Object.values(eventHandlers).forEach((eventHandler) => {
    console.log(`    ${eventHandler.event}`)
    client.on(eventHandler.event, eventHandler.handler)
  })
}
