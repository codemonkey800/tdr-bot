import { Client } from 'discord.js'
import {
  RecurrenceRule,
  RecurrenceSpecDateRange,
  RecurrenceSpecObjLit,
} from 'node-schedule'

export type ScheduleRule =
  | RecurrenceRule
  | RecurrenceSpecDateRange
  | RecurrenceSpecObjLit
  | Date
  | string
  | number

export interface Schedule {
  name: string
  get rule(): ScheduleRule
  execute(client: Client<boolean>): void
}
