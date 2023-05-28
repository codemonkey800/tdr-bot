import { Client, Events, GatewayIntentBits } from 'discord.js'
import { Container } from 'inversify'
import {
  AllCommands,
  CommandRegistrar,
  CommandSetup,
  CrumbleCookiesCommand,
  FlipCoinCommand,
  RollDiceCommand,
} from 'src/commands'
import { EventManager } from 'src/events/event-manager'
import { HandleConversationOnMessageEvent } from 'src/events/handle-conversation'
import { SendWarOnWarMessageEvent } from 'src/events/send-war-on-war-message'
import { Scheduler, WeeklyCrumblCookiesSchedule } from 'src/schedule'

import { logger } from './logger'
import { getAPIToken } from './utils'

export class Application {
  private container: Container

  constructor() {
    this.container = new Container()
    this.bindCommands()
    this.bindSchedules()
    this.bindEvents()
  }

  private bindCommands() {
    this.container.bind(CommandSetup).toSelf()
    this.container.bind(CommandRegistrar).toSelf()
    this.container.bind(AllCommands).toSelf()
    this.container.bind(CrumbleCookiesCommand).toSelf()
    this.container.bind(FlipCoinCommand).toSelf()
    this.container.bind(RollDiceCommand).toSelf()
  }

  private bindSchedules() {
    this.container.bind(Scheduler).toSelf()
    this.container.bind(WeeklyCrumblCookiesSchedule).toSelf()
  }

  private bindEvents() {
    this.container.bind(EventManager).toSelf()
    this.container.bind(SendWarOnWarMessageEvent).toSelf()
    this.container.bind(HandleConversationOnMessageEvent).toSelf()
  }

  private handleClientReady() {
    const setup = this.container.get(CommandSetup)
    setup.setupCommandHandlers()

    const scheduler = this.container.get(Scheduler)
    scheduler.scheduleJobs()

    const eventManager = this.container.get(EventManager)
    eventManager.listenToEvents()
  }

  async start() {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    })

    client.once(Events.ClientReady, (readyClient) => {
      this.container.bind(Client).toConstantValue(readyClient)
      this.handleClientReady()
    })

    try {
      const token = getAPIToken()
      await client.login(token)
      logger.log('Started tdr-bot 🫡')
    } catch (err) {
      logger.error('Failed to login to Discord client', err)
    }
  }

  async registerCommands() {
    const registrar = this.container.get(CommandRegistrar)
    await registrar.registerCommands()
  }
}
