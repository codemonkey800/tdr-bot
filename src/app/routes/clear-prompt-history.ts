import { getModule } from 'src/modules'

export async function action() {
  const serverState = getModule('state')
  serverState.promptHistory = []

  return { ok: true }
}
