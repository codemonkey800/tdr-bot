declare namespace NodeJS {
  interface ProcessEnv {
    readonly DISCORD_API_TOKEN: string
    readonly DISCORD_CLIENT_ID: string
    readonly OPENAI_API_KEY: string
    readonly PORT?: string
    readonly SERP_API_KEY: string
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

declare module '*.html' {
  const content: string
  // eslint-disable-next-line import/no-default-export
  export default content
}
