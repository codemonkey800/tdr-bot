import 'reflect-metadata'

import dotenv from 'dotenv'
import yargs from 'yargs'

import { Application } from './core/app'

dotenv.config()

async function main() {
  const app = new Application()

  await yargs
    .option('breh', { type: 'string' })
    .command('start', 'Starts Discord bot', () => app.start())
    .command('register', 'Register commands', () => app.registerCommands())
    .demandCommand(1, 'You must specify at least 1 command')
    .scriptName('./tdr-bot')
    .alias('h', 'help')
    .alias('v', 'version')
    .version('420.69')
    .help()
    .strict()
    .parse()
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
