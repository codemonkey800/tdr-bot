import { ActionArgs } from '@remix-run/node'
import { getServerState } from 'src/state'

export async function action({ request }: ActionArgs) {
  const data = await request.formData()
  const index = data.get('index')?.toString()

  if (!index || Number.isNaN(+index)) {
    return { ok: false }
  }

  const serverState = getServerState()
  serverState.setPrompt(serverState.promptHistory[+index])

  return { ok: true }
}
