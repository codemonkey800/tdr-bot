import { Logger } from '@nestjs/common'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'
import { TestMessagePayload } from '@tdr-bot/shared'
import { Socket } from 'socket.io'

@WebSocketGateway({ namespace: 'app', cors: true })
export class AppWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(AppWebSocketGateway.name)

  afterInit() {
    this.logger.log('[websocket] init')
  }

  handleConnection(client: Socket) {
    this.logger.log('[websocket] got connection', { id: client.id })
  }

  handleDisconnect(client: Socket) {
    this.logger.log('[websocket] client disconnected', { id: client.id })
  }

  @SubscribeMessage('testClient')
  handleTestMessage(socket: Socket, payload: TestMessagePayload) {
    this.logger.log('got message', {
      id: socket.id,
      payload,
    })

    return {
      event: 'testServer',
      data: { message: 'yooo' } as TestMessagePayload,
    }
  }
}
