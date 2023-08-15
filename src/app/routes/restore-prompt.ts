import { ActionArgs } from '@remix-run/node'
import { getModule } from 'src/modules'

export async function action({ request }: ActionArgs) {
  const data = await request.formData()
  const index = data.get('index')?.toString()

  if (!index || Number.isNaN(+index)) {
    return { ok: false }
  }

  const serverState = getModule('state')
  serverState.setPrompt(serverState.promptHistory[+index])

  return { ok: true }
}
