import { CanActivate, ExecutionContext, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Message } from 'discord.js'

export class MessageFromUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const message = context.getArgByIndex<Message>(0)
    return !message.author.bot
  }
}

export class MessageMentioningBotGuard implements CanActivate {
  constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const message = context.getArgByIndex<Message>(0)
    const clientId = this.config.get<string>('DISCORD_CLIENT_ID')

    return message.mentions.users.has(clientId)
  }
}
