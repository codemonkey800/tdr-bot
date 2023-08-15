declare namespace NodeJS {
  interface ProcessEnv {
    DISCORD_API_TOKEN: string
    DISCORD_CLIENT_ID: string
    OPENAI_API_KEY: string
    SERPAPI_API_KEY: string
  }
}

declare module 'google-search-results-nodejs' {
  export interface SearchParams {
    gl: string
    google_domain: string
    hl: string
    location: string
    q: string
  }

  export class GoogleSearch {
    constructor(apiKey: string)
    json<T>(params: SearchParams, callback: (data: T) => void): void
  }
}
