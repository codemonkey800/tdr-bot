import { DiscordModule, DiscordModuleAsyncOptions } from '@discord-nestjs/core'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { GatewayIntentBits } from 'discord.js'

import { ChatModule } from './chat/chat.module'
import { CommandsModule } from './commands/commands.module'
import { OAuthModule } from './oauth/oauth.module'
import { StateModule } from './state/state.module'
import { TasksModule } from './tasks/tasks.module'
import { AppWebSocketModule } from './ws/ws.module'

const DISCORD_MODULE_OPTIONS: DiscordModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],

  useFactory: (config: ConfigService) => ({
    token: config.get('DISCORD_API_TOKEN'),

    discordClientOptions: {
      intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        // You must allow message content for your application in discord developers
        // https://support-dev.discord.com/hc/en-us/articles/4404772028055
        GatewayIntentBits.MessageContent,
      ],
    },
  }),
}

@Module({
  imports: [
    AppWebSocketModule,
    ChatModule,
    CommandsModule,
    ConfigModule.forRoot(),
    DiscordModule.forRootAsync(DISCORD_MODULE_OPTIONS),
    OAuthModule,
    ScheduleModule.forRoot(),
    StateModule,
    TasksModule,
  ],
})
export class AppModule {}
