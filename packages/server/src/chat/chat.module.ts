import { DiscordModule } from '@discord-nestjs/core'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { ChatGateway } from './chat.gateway'
import { ChatService } from './chat.service'
import { SearchService } from './search.service'

@Module({
  imports: [ConfigModule, DiscordModule.forFeature()],
  providers: [ChatGateway, ChatService, SearchService],
})
export class ChatModule {}
