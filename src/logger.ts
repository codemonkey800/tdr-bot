class Logger {
  private getPrefix(...tags: string[]) {
    const prefixTags = [new Date().toISOString(), ...tags].map(
      (tag) => `[${tag}]`,
    )
    return prefixTags.join('')
  }

  log(...messages: unknown[]) {
    console.log(this.getPrefix(), ...messages)
  }

  error(message?: unknown, ...params: unknown[]) {
    console.error(this.getPrefix('ERROR'), message, ...params)
  }
}

export const logger = new Logger()
