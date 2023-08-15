import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
} from 'openai'
import { KAWAII_PROMPT, getFullPrompt } from './prompts'

type ExcludeMatchingProperties<T, V> = Pick<
  T,
  { [K in keyof T]-?: T[K] extends V ? never : K }[keyof T]
>

export type ServerStateProperties = ExcludeMatchingProperties<
  ServerState,
  Function
>

export class ServerState {
  messageMax = 100
  messageSlice = 50
  messages: ChatCompletionRequestMessage[] = []
  prompt = KAWAII_PROMPT
  promptHistory: string[] = []

  addMessage(message: ChatCompletionRequestMessage) {
    this.messages.push(message)

    if (this.messages.length > this.messageMax) {
      this.messages = this.messages.slice(this.messageSlice)
    }
  }

  setPrompt(prompt: string): void {
    this.prompt = prompt
    this.promptHistory.push(prompt)
    this.messages = []
  }

  get history() {
    return [
      {
        role: 'system',
        content: getFullPrompt(this.prompt.trim()),
      } as ChatCompletionResponseMessage,
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
