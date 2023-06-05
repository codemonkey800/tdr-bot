import { Client } from 'discord.js'
import { injectable } from 'inversify'
import { RecurrenceRule } from 'node-schedule'
import { getWeeklyCookiesMessage } from 'src/apis/crumbl'
import { logger } from 'src/core/logger'

import { BaseSchedule } from './base-schedule'

@injectable()
export class WeeklyCrumblCookiesSchedule extends BaseSchedule {
  name = 'weekly-crumbl-cookies'

  constructor(private readonly client: Client<true>) {
    super()
  }

  // Post weekly message at 10am PST on Monday
  get rule() {
    const rule = new RecurrenceRule()
    rule.dayOfWeek = 1
    rule.hour = 10
    rule.minute = 0
    rule.second = 0
    rule.tz = 'US/Pacific'

    return rule
  }

  async handleJob() {
    // Find all channels named 'food'
    const channels = this.client.guilds.cache.flatMap((guild) =>
      guild.channels.cache.filter((channel) => channel.name === 'food'),
    )
    const totalChannels = channels.reduce((total) => total + 1, 0)
    logger.log(`Sending to ${totalChannels} channels `)

    // Send weekly Crumbl cookies message to each channel and wait for all to finish
    await Promise.allSettled(
      channels.map(async (channel) => {
        if (!channel.isTextBased()) {
          return
        }

        logger.log('Sending weekly Crumbl cookies')
        await channel.send(await getWeeklyCookiesMessage({ showEmbeds: true }))
      }),
    )

    logger.log('Finished sending weekly Crumbl cookies')
  }
}
