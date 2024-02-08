import { DiscordModule } from '@discord-nestjs/core'
import { Module } from '@nestjs/common'

import { CrumblTask } from './crumbl.task'

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [CrumblTask],
})
export class TasksModule {}
