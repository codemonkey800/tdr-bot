export function env(key: string): string {
  const value = process.env[key]

  if (!value) {
    throw new Error(`${key} not defined`)
  }

  return value
}

export function getAPIToken(): string {
  const key = 'DISCORD_API_TOKEN'
  return env(key)
}

export function getClientID(): string {
  const key = 'DISCORD_CLIENT_ID'
  return env(key)
}
