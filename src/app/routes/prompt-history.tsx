import { json, type V2_MetaFunction } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { getServerState, ServerStateProperties } from 'src/state'
import { Navigation } from '../components/Navigation'

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'TDR Bot - Prompt History' },
    { name: 'description', content: 'Prompt history for TDR Bot' },
  ]
}

export function loader() {
  const serverState = getServerState()
  return json(serverState.toJSON())
}

export default function Index() {
  const clearMessagesFetcher = useFetcher()
  const restorePromptFetcher = useFetcher()
  const removePromptFetcher = useFetcher()
  const state = useLoaderData<ServerStateProperties>()

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col flex-auto p-4 items-center overflow-y-auto">
      <Navigation />

      <div className="flex flex-col w-full max-w-[80vw] md:max-w-[60vw] mt-8 mb-4 gap-2">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold">
            Prompt History ({state.promptHistory.length})
          </p>

          <clearMessagesFetcher.Form
            method="post"
            action="/clear-prompt-history"
          >
            <button
              className="bg-purple-600 hover:bg-purple-500 px-2 py-1 rounded "
              type="submit"
            >
              Clear
            </button>
          </clearMessagesFetcher.Form>
        </div>

        <div className="flex flex-col gap-2">
          {state.promptHistory
            .slice()
            .reverse()
            .map((prompt, index) => (
              <div key={prompt} className="bg-gray-800 p-3 flex flex-col gap-2">
                <p>{prompt}</p>

                <div className="flex gap-3">
                  <restorePromptFetcher.Form
                    method="post"
                    action="/restore-prompt"
                  >
                    <input name="index" type="hidden" defaultValue={index} />
                    <button
                      className="bg-purple-600 hover:bg-purple-500 rounded py-2 px-1 text-sm mt-3"
                      type="submit"
                    >
                      Restore
                    </button>
                  </restorePromptFetcher.Form>

                  <removePromptFetcher.Form
                    method="post"
                    action="/remove-prompt"
                  >
                    <input name="index" type="hidden" defaultValue={index} />
                    <button
                      className="bg-purple-600 hover:bg-purple-500 rounded py-2 px-1 text-sm mt-3"
                      type="submit"
                    >
                      Remove
                    </button>
                  </removePromptFetcher.Form>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
