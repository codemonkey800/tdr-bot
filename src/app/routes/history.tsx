import { json, type V2_MetaFunction } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { getServerState, ServerStateProperties } from 'src/state'
import { Navigation } from '../components/Navigation'

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'TDR Bot - Chat History' },
    { name: 'description', content: 'Chat history for TDR Bot' },
  ]
}

export function loader() {
  const serverState = getServerState()
  return json(serverState.toJSON())
}

function formatMessageContent(content = '') {
  try {
    const obj = JSON.parse(content)
    return <pre>{JSON.stringify(obj, null, 2)}</pre>
  } catch (_) {
    return content
  }
}

export default function Index() {
  const clearMessagesFetcher = useFetcher()
  const state = useLoaderData<ServerStateProperties>()

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col flex-auto p-4 items-center overflow-y-auto">
      <Navigation />

      <div className="flex flex-col max-w-[80vw] md:max-w-[60vw] mt-8 mb-4 gap-2">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold">
            Chat History ({state.history.length})
          </p>

          <clearMessagesFetcher.Form method="post" action="/clear-messages">
            <button className="bg-purple-600 px-2 py-1 rounded " type="submit">
              Clear
            </button>
          </clearMessagesFetcher.Form>
        </div>

        <div className="flex flex-col gap-2">
          {state.history
            .slice()
            .reverse()
            .map((message) => (
              <div
                key={message.content}
                className="bg-gray-800 p-3 flex flex-col gap-2"
              >
                <p>Role: {message.role}</p>
                <div className="overflow-auto max-h-[600px]">
                  {message.function_call ? (
                    <>
                      <p className="text-sm ml-4">
                        Function: {message.function_call.name}
                      </p>
                      <p className="text-sm ml-4">
                        Args:{' '}
                        {formatMessageContent(message.function_call.arguments)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm ml-4">
                      {formatMessageContent(message.content)}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
