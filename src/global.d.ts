import { ServerState } from './state'

declare namespace NodeJS {
  interface ProcessEnv {
    DISCORD_API_TOKEN: string
    DISCORD_CLIENT_ID: string
    OPENAI_API_KEY: string
    SERPAPI_API_KEY: string
  }
}

declare namespace global {
  var serverState: ServerState
}
