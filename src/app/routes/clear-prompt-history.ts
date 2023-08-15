import { getServerState } from 'src/state'

export async function action() {
  const serverState = getServerState()
  serverState.promptHistory = []

  return { ok: true }
}
