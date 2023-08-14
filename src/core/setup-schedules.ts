import { Client } from 'discord.js'
import { scheduleJob } from 'node-schedule'
import * as schedules from 'src/schedules'

export function setupSchedules(client: Client<boolean>) {
  Object.values(schedules).forEach((schedule) => {
    console.log(`Scheduling job ${schedule.name}`)
    scheduleJob(schedule.name, schedule.rule, () => schedule.execute(client))
  })
}
