import { InjectDiscordClient, Once } from '@discord-nestjs/core'
import { Injectable } from '@nestjs/common'
import { Client } from 'discord.js'

@Injectable()
export class StateService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  userIdMap: Map<string, string> = new Map<string, string>()
}
