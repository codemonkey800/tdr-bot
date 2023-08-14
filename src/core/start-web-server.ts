import { createRequestHandler } from '@remix-run/express'
import { broadcastDevReady, ServerBuild } from '@remix-run/node'
import chokidar from 'chokidar'
import compression from 'compression'
import express, { RequestHandler } from 'express'
import fs from 'fs/promises'
import morgan from 'morgan'
import path from 'path'
import url from 'url'

const DIRNAME = url.fileURLToPath(new URL('.', import.meta.url))
const BUILD_PATH = path.resolve(DIRNAME, '../../build/index.js')
const PORT = process.env.PORT || 8080

function importBuild(time?: number) {
  return import(
    `${BUILD_PATH}${time ? `?t=${time}` : ''}`
  ) as Promise<ServerBuild>
}

export async function startWebServer() {
  let build: ServerBuild | Promise<ServerBuild> = await importBuild()
  const app = express()

  const createDevRequestHandler = (): RequestHandler => {
    const watcher = chokidar.watch(BUILD_PATH, { ignoreInitial: true })

    watcher.on('all', async () => {
      // 1. purge require cache && load updated server build
      const stat = await fs.stat(BUILD_PATH)
      build = importBuild(stat.mtimeMs)
      // 2. tell dev server that this app server is now ready
      await broadcastDevReady(await build)
    })

    return async (req, res, next) => {
      try {
        await createRequestHandler({
          build: await build,
          mode: 'development',
        })(req, res, next)
      } catch (error) {
        next(error)
      }
    }
  }

  app.use(compression())

  // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
  app.disable('x-powered-by')

  // Remix fingerprints its assets so we can cache forever.
  app.use(
    '/build',
    express.static('public/build', { immutable: true, maxAge: '1y' }),
  )

  // Everything else (like favicon.ico) is cached for an hour. You may want to be
  // more aggressive with this caching.
  app.use(express.static('public', { maxAge: '1h' }))

  app.use(morgan('tiny'))

  app.all(
    '*',
    process.env.NODE_ENV === 'development'
      ? createDevRequestHandler()
      : createRequestHandler({
          build,
          mode: process.env.NODE_ENV,
        }),
  )

  app.listen(PORT, async () => {
    console.log(`Express server listening on port ${PORT}`)

    if (process.env.NODE_ENV === 'development') {
      await broadcastDevReady(await build)
    }
  })
}
