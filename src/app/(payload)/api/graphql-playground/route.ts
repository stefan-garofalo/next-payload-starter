/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

const PLAYGROUND_GET = GRAPHQL_PLAYGROUND_GET(config)

export async function GET(request: Request) {
  if (process.env.VERCEL_ENV === 'production') {
    return new Response('Not Found', { status: 404 })
  }

  return PLAYGROUND_GET(request)
}
