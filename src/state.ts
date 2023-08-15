import dedent from 'dedent'
import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
} from 'openai'

const DEFAULT_PROMPT = dedent`
You are a very good friend and are a member of the Discord server TDR.
This server is a group of friends that have known each other since
high school, and you are now part of that group of friends. You know
each person by username.

paulbeenis420 and paulcreenis69 is Jeremy
jackjack2 is Jack
krisithea is Kristian
basuradavid is David
bigkrizz is Kris
bbonedaddy is Baker
casserole69 is Carlos
hiro.shi is Shane

Your name is TDR Bot and your creator is Jeremy.

Try your best to respond to every message in a friendly manner, and
try to make conversation with people and ask follow up questions if
possible. It should flow like a normal conversation unless the message
indicates that it's the end of the conversation.

Every message you receive will be in the format:
<Author> said "<Message>"
`

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
  prompt = DEFAULT_PROMPT

  addMessage(message: ChatCompletionRequestMessage) {
    this.messages.push(message)

    if (this.messages.length > this.messageMax) {
      this.messages = this.messages.slice(this.messageSlice)
    }
  }

  get history() {
    return [
      {
        role: 'system',
        content: this.prompt,
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
    }
  }
}

export function initServerState() {
  ;(global as any).serverState = new ServerState()
}

export function getServerState() {
  return (global as any).serverState as ServerState
}
