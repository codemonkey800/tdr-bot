export const DISCORD_MAX_LENGTH = 2000

export function splitMessage(message: string): string[] {
  const messages: string[] = []

  while (message.length > 0) {
    if (message.length <= DISCORD_MAX_LENGTH) {
      messages.push(message)
      break
    }

    let lastSpaceIndex = message.lastIndexOf(' ', DISCORD_MAX_LENGTH)
    lastSpaceIndex = lastSpaceIndex <= 0 ? DISCORD_MAX_LENGTH : lastSpaceIndex

    messages.push(message.substring(0, lastSpaceIndex).trim())
    // eslint-disable-next-line no-param-reassign
    message = message.substring(lastSpaceIndex).trim()
  }

  return messages.filter(Boolean)
}
