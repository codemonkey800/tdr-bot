import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'

import { AppModule } from './app.module'

async function main() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()

  const config = app.get(ConfigService)
  const port = +(config.get('PORT') || 8081)
  await app.listen(port)

  // eslint-disable-next-line no-console
  console.log(`Started tdr-bot server at http://localhost:${port}`)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
