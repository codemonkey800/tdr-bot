import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
} from 'openai'
import { KAWAII_PROMPT, getFullPrompt } from './prompts'
import { Job } from 'node-schedule'
import fs from 'fs'

type ExcludeMatchingProperties<T, V> = Pick<
  T,
  { [K in keyof T]-?: T[K] extends V ? never : K }[keyof T]
>

export type ServerStateProperties = ExcludeMatchingProperties<
  ServerState,
  Function | Map<unknown, unknown>
>

export interface ReminderState {
  creator: string
  date?: string
  details: string
  job: Job
  user: string
}

export class ServerState {
  messageMax = 100
  messageSlice = 50
  messages: ChatCompletionRequestMessage[] = []
  prompt = KAWAII_PROMPT
  promptHistory: string[] = []
  reminders = new Map<string, ReminderState>()
  userIdMap = new Map<string, string>()

  addMessage(message: ChatCompletionRequestMessage) {
    this.messages.push(message)

    if (this.messages.length > this.messageMax) {
      this.messages = this.messages.slice(this.messageSlice)
    }

    fs.writeFileSync(
      'message-history.json',
      JSON.stringify(this.history, null, 2),
    )
  }

  setPrompt(prompt: string): void {
    this.prompt = prompt
    this.promptHistory.push(prompt)
    this.messages = []
  }

  get history() {
    const reminderIds = Array.from(this.reminders.keys())

    return [
      {
        role: 'system',
        content: getFullPrompt(this.prompt.trim()),
      } as ChatCompletionResponseMessage,

      ...(this.userIdMap.size === 0
        ? []
        : [
            {
              role: 'system',
              content: [
                'The following object is a mapping of user IDs to usernames.',
                'Always reference users by their ID and not their username in the format `<@${user_id}>`.',
                JSON.stringify(Object.fromEntries(this.userIdMap.entries())),
              ].join('\n'),
            } as ChatCompletionResponseMessage,
          ]),

      ...(reminderIds.length === 0
        ? []
        : [
            {
              role: 'system',
              content: `All existing reminder IDs: ${reminderIds.join(', ')}`,
            } as ChatCompletionResponseMessage,
          ]),

      ...this.messages,
    ]
  }

  toJSON(): ServerStateProperties {
    return {
      history: this.history,
      messageMax: this.messageSlice,
      messages: this.messages,
      messageSlice: this.messageSlice,
      prompt: this.prompt,
      promptHistory: this.promptHistory,
    }
  }
}

export function getServerState() {
  return (global as any).serverState as ServerState
}
