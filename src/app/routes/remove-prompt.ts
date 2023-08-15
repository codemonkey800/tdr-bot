import { ActionArgs } from '@remix-run/node'
import { getModule } from 'src/modules'

export async function action({ request }: ActionArgs) {
  const data = await request.formData()
  const index = data.get('index')?.toString()

  if (!index || Number.isNaN(+index)) {
    return { ok: false }
  }

  const serverState = getModule('state')
  serverState.promptHistory = serverState.promptHistory.filter(
    (_, idx) => idx !== +index,
  )

  return { ok: true }
}
