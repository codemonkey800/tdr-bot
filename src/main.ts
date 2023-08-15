import { installGlobals } from '@remix-run/node'
import dotenv from 'dotenv'
import sourceMapSupport from 'source-map-support'
import { startWebServer } from './core/start-web-server'
import { startBot } from './core'
import { ServerState } from './state'
import { addModule } from './modules'

dotenv.config()
sourceMapSupport.install()
installGlobals()

async function main() {
  addModule('state', new ServerState())
  await Promise.all([startBot(), startWebServer()])
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
