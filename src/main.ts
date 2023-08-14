import { installGlobals } from '@remix-run/node'
import dotenv from 'dotenv'
import sourceMapSupport from 'source-map-support'
// import { startWebServer } from './core/start-web-server'
import { startBot } from './core'

dotenv.config()
sourceMapSupport.install()
installGlobals()

async function main() {
  await startBot()
  // await Promise.all([startBot(), startWebServer()])
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
