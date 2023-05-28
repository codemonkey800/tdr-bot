import { injectable } from 'inversify'
import { logger } from 'src/core/logger'

import { BaseSchedule } from './base-schedule'
import { WeeklyCrumblCookiesSchedule } from './weekly-crumbl-cookies'

@injectable()
export class Scheduler {
  jobs = new Map<string, BaseSchedule>()

  constructor(
    private readonly weeklyCrumblCookies: WeeklyCrumblCookiesSchedule,
  ) {}

  scheduleJobs() {
    const schedules = [this.weeklyCrumblCookies]

    for (const schedule of schedules) {
      const job = schedule.schedule()
      this.jobs.set(job.name, schedule)
    }

    logger.log('Scheduled jobs:')
    for (const name of this.jobs.keys()) {
      logger.log('  ', name)
    }
  }
}
