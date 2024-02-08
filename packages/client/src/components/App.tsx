import { ClientToServerEvents, ServerToClientEvents } from '@tdr-bot/shared'
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'ws://localhost:8081/app',
)

export function App() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [messages, setMessages] = useState<unknown[]>([])

  useEffect(() => {
    function onConnect() {
      console.log('connected to server')
      setIsConnected(true)
    }

    function onDisconnect() {
      console.log('disconnected from server')
    }

    function handleMessage(message: unknown) {
      console.log('got message', message)
      setMessages((prev) => prev.concat(message))
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('testServer', handleMessage)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('testServer', handleMessage)
    }
  })

  return (
    <div className="bg-gray-800 w-full h-full text-white p-4">
      <p className="text-4xl">Connected: {String(isConnected)}</p>

      <button
        className="bg-purple-500 rounded p-2 mt-4"
        onClick={() => {
          socket.emit('testClient', {
            message: 'breh',
          })
        }}
        type="button"
      >
        Send Message
      </button>

      <p className="text-3xl">Messages:</p>
      <ul className="list-disc list-inside">
        {messages.map((message) => (
          <li>{JSON.stringify(message)}</li>
        ))}
      </ul>
    </div>
  )
}
