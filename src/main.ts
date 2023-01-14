import dotenv from 'dotenv'

import { postWeeklyCookies } from './cli/postWeeklyCookies'
import { registerCommands } from './cli/registerCommands'
import { start } from './cli/start'

dotenv.config()

async function main([command]: string[]) {
  switch (command) {
    case 'register-commands':
      await registerCommands()
      break

    case 'post-weekly-cookies':
      await postWeeklyCookies()
      break

    default:
      await start()
      break
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main(process.argv.slice(2))
