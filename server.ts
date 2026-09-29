/**
 * TanStack Start production server with Bun.
 * Serves prebuilt client assets and falls back to the Start fetch handler.
 */
import path from 'node:path'
import { env } from './src/lib/env.lib.ts'
import { logger } from './src/lib/logger.lib.ts'

const SERVER_PORT = env.PORT
const CLIENT_DIRECTORY = './dist/client'
const SERVER_ENTRY_POINT = './dist/server/server.js'

const MAX_PRELOAD_BYTES = 5 * 1024 * 1024

interface InMemoryAsset {
  raw: Uint8Array
  type: string
  etag: string
  size: number
}

function computeEtag(data: Uint8Array): string {
  const hash = Bun.hash(data)
  return `W/"${hash.toString(16)}-${data.byteLength.toString()}"`
}

async function initializeStaticRoutes(): Promise<
  Record<string, (req: Request) => Response>
> {
  const routes: Record<string, (req: Request) => Response> = {}
  const glob = new Bun.Glob('**/*')

  for await (const relativePath of glob.scan({ cwd: CLIENT_DIRECTORY })) {
    const filepath = path.join(CLIENT_DIRECTORY, relativePath)
    const route = `/${relativePath.split(path.sep).join(path.posix.sep)}`
    try {
      const file = Bun.file(filepath)
      if (!(await file.exists()) || file.size === 0) continue
      const type = file.type || 'application/octet-stream'
      if (file.size <= MAX_PRELOAD_BYTES) {
        const bytes = new Uint8Array(await file.arrayBuffer())
        const asset: InMemoryAsset = {
          raw: bytes,
          type,
          etag: computeEtag(bytes),
          size: bytes.byteLength,
        }
        routes[route] = (req: Request) => {
          const headers: Record<string, string> = {
            'Content-Type': asset.type,
            'Cache-Control': 'public, max-age=31536000, immutable',
            ETag: asset.etag,
          }
          if (req.headers.get('if-none-match') === asset.etag) {
            return new Response(null, { status: 304, headers })
          }
          headers['Content-Length'] = String(asset.raw.byteLength)
          return new Response(new Uint8Array(asset.raw), { status: 200, headers })
        }
      } else {
        routes[route] = () =>
          new Response(Bun.file(filepath), {
            headers: {
              'Content-Type': type,
              'Cache-Control': 'public, max-age=3600',
            },
          })
      }
    } catch {
      // skip unreadable entries
    }
  }
  return routes
}

async function main() {
  const serverModule = (await import(SERVER_ENTRY_POINT)) as {
    default: { fetch: (request: Request) => Response | Promise<Response> }
  }
  const handler = serverModule.default
  const routes = await initializeStaticRoutes()

  Bun.serve({
    port: SERVER_PORT,
    routes: {
      ...routes,
      '/*': (req: Request) => {
        try {
          return handler.fetch(req)
        } catch (error) {
          logger.error('Server handler error:', error)
          return new Response('Internal Server Error', { status: 500 })
        }
      },
    },
    error(error) {
      logger.error('Uncaught server error:', error)
      return new Response('Internal Server Error', { status: 500 })
    },
  })

  logger.info(`Server listening on http://localhost:${SERVER_PORT}`)
}

main().catch((error) => {
  logger.error('Failed to start server:', error)
  process.exit(1)
})
