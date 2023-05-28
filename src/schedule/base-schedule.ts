import { injectable } from 'inversify'
import {
  Job,
  RecurrenceRule,
  RecurrenceSpecDateRange,
  RecurrenceSpecObjLit,
  scheduleJob,
} from 'node-schedule'

export type ScheduleRule =
  | RecurrenceRule
  | RecurrenceSpecDateRange
  | RecurrenceSpecObjLit
  | Date
  | string
  | number

@injectable()
export abstract class BaseSchedule {
  abstract name: string
  abstract get rule(): ScheduleRule
  abstract handleJob(): void

  schedule(): Job {
    return scheduleJob(this.name, this.rule, this.handleJob.bind(this))
  }
}
