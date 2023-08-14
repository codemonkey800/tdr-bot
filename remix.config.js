import path from 'path'
import url from 'url'

const DIRNAME = url.fileURLToPath(new URL('.', import.meta.url))

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  appDirectory: path.resolve(DIRNAME, 'src/app'),
  ignoredRouteFiles: ['**/.*'],
  serverBuildPath: path.resolve(DIRNAME, 'build/index.js'),
  serverModuleFormat: 'esm',
  tailwind: true,

  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
}
