import type { V2_MetaFunction } from '@remix-run/node'

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'TDR Bot Console' },
    { name: 'description', content: 'Console for TDR Bot' },
  ]
}

export default function Index() {
  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col flex-auto">
      <div className="flex flex-col flex-auto items-center justify-center">
        <img src="/sad-pepe.png" width="320px" />
        <p className="text-[8vw]">TDR Bot</p>
      </div>
    </div>
  )
}
