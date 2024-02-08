import { InjectDiscordClient } from '@discord-nestjs/core'
import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { Client } from 'discord.js'

import { getWeeklyCookiesMessage } from 'src/apis/crumbl'

@Injectable()
export class CrumblTask {
  private readonly logger = new Logger(CrumblTask.name)

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Cron('0 10 * * SUN', { timeZone: 'US/Pacific' })
  async getWeeklyCrumblCookies() {
    // Find all channels named 'food'
    const channels = this.client.guilds.cache.flatMap((guild) =>
      guild.channels.cache.filter((channel) => channel.name === 'food'),
    )
    const totalChannels = channels.reduce((total) => total + 1, 0)
    this.logger.log(`Sending to ${totalChannels} channels `)

    // Send weekly Crumbl cookies message to each channel and wait for all to finish
    await Promise.allSettled(
      channels.map(async (channel) => {
        if (!channel.isTextBased()) {
          return
        }

        this.logger.log('Sending weekly Crumbl cookies')
        await channel.send(await getWeeklyCookiesMessage({ showEmbeds: true }))
      }),
    )

    this.logger.log('Finished sending weekly Crumbl cookies')
  }
}
