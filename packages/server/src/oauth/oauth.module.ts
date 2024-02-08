import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { OAuthController } from './oauth.controller'

@Module({
  controllers: [OAuthController],
  imports: [ConfigModule],
})
export class OAuthModule {}
