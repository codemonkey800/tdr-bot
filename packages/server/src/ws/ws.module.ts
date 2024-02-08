import { Module } from '@nestjs/common'

import { AppWebSocketGateway } from './ws.gateway'

@Module({
  providers: [AppWebSocketGateway],
})
export class AppWebSocketModule {}
