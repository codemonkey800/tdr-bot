import { getServerState } from 'src/state'

export async function action() {
  const serverState = getServerState()
  serverState.messages = []

  return { ok: true }
}
