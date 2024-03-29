/* eslint-disable no-param-reassign */
/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import { PassThrough } from 'node:stream'

import type { EntryContext } from '@remix-run/node'
import { Response } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import isbot from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'

const ABORT_DELAY = 5_000

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const isBot = isbot(request.headers.get('user-agent'))

  return new Promise((resolve, reject) => {
    let shellRendered = false

    function onReady() {
      shellRendered = true
      const body = new PassThrough()

      responseHeaders.set('Content-Type', 'text/html')

      resolve(
        new Response(body, {
          headers: responseHeaders,
          status: responseStatusCode,
        }),
      )

      pipe(body)
    }

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,

      {
        onAllReady: isBot ? onReady : undefined,
        onShellReady: isBot ? undefined : onReady,

        onShellError(error: unknown) {
          reject(error)
        },

        onError(error: unknown) {
          responseStatusCode = 500

          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error)
          }
        },
      },
    )

    setTimeout(abort, ABORT_DELAY)
  })
}
