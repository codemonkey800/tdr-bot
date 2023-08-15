import { ActionArgs, json, type V2_MetaFunction } from '@remix-run/node'
import {
  Form,
  useFetcher,
  useLoaderData,
  useRevalidator,
} from '@remix-run/react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { getServerState, ServerStateProperties } from 'src/state'
import { Navigation } from '../components/Navigation'

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'TDR Bot Console' },
    { name: 'description', content: 'Console for TDR Bot' },
  ]
}

export function loader() {
  const serverState = getServerState()
  return json(serverState.toJSON())
}

export async function action({ request }: ActionArgs) {
  const body = await request.formData()

  const serverState = getServerState()
  serverState.prompt = body.get('prompt')?.toString() ?? serverState.prompt
  serverState.messages = []

  return json(serverState.toJSON())
}

export default function Index() {
  const clearMessagesFetcher = useFetcher()
  const state = useLoaderData<ServerStateProperties>()
  const revalidator = useRevalidator()

  useEffect(() => {
    if (
      clearMessagesFetcher.state === 'idle' &&
      clearMessagesFetcher.data?.ok
    ) {
      revalidator.revalidate()
    }
  }, [])

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col flex-auto p-4 items-center overflow-y-auto">
      <Navigation />

      <Form
        className="flex flex-col w-full max-w-[80vw] md:max-w-[60vw]"
        method="post"
      >
        <p className="text-2xl font-semibold mb-3">Prompt</p>
        <textarea
          name="prompt"
          className={clsx(
            'bg-gray-800 rounded w-full text-lg p-4 min-h-[400px]',
            'border border-black',
            'outline-none focus:outline-none shadow-none',
          )}
          defaultValue={state.prompt}
        />

        <p className="text-2xl font-semibold mt-8 mb-3">Message Bounds</p>
        <div className="grid gap-4 grid-cols-[150px,1fr]">
          <p className="whitespace-nowrap">Message Max</p>
          <input
            className="bg-gray-800 w-full p-2 focus:outline-none"
            name="messageMax"
            defaultValue={`${state.messageMax}`}
            type="number"
            min={1}
          />

          <p>Message Slice</p>
          <input
            className="bg-gray-800 w-full p-2 focus:outline-none"
            name="messageSlice"
            defaultValue={`${state.messageSlice}`}
            type="number"
            min={1}
          />
        </div>

        <div className="flex justify-between mt-[32px]">
          <div />

          <button className="bg-purple-600 px-2 py-1 rounded" type="submit">
            Update
          </button>
        </div>
      </Form>
    </div>
  )
}
