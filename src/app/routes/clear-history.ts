import { getModule } from 'src/modules'

export async function action() {
  const serverState = getModule('state')
  serverState.messages = []

  return { ok: true }
}
