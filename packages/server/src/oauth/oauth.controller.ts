import { Controller, Get, Logger, Query } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

import oauthPage from './oauth.html'

@Controller('oauth')
export class OAuthController {
  private readonly logger = new Logger(OAuthController.name)

  constructor(private readonly config: ConfigService) {}

  @Get()
  async getOauthPage(@Query('code') code?: string) {
    if (code) {
      try {
        const opts = {
          client_id: this.config.get('DISCORD_CLIENT_ID'),
          client_secret: this.config.get('DISCORD_API_TOKEN'),
          code,
          grant_type: 'authorization_code',
          redirect_uri: `http://localhost:${
            this.config.get('PORT') || 8081
          }/oauth`,
          scope: 'identify',
        }

        console.log('breh', opts)

        const tokenResponseData = await axios.post(
          'https://discord.com/api/oauth2/token',
          {
            body: new URLSearchParams({
              client_id: this.config.get('DISCORD_CLIENT_ID'),
              client_secret: this.config.get('DISCORD_API_TOKEN'),
              code,
              grant_type: 'authorization_code',
              redirect_uri: `http://localhost:${
                this.config.get('PORT') || 8081
              }/oauth`,
              scope: 'identify',
            }).toString(),

            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )

        const oauthData = tokenResponseData.data as unknown
        this.logger.log(oauthData)
      } catch (err) {
        console.log(err)
        this.logger.error(err)
      }
    }

    return oauthPage
  }
}
