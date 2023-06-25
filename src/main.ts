import dotenv from 'dotenv'
import yargs from 'yargs'

import * as app from './app'

dotenv.config()

async function main() {
  await yargs
    .command('start', 'Starts Discord bot', app.startBot)
    .command('register', 'Register commands', app.registerCommands)
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
