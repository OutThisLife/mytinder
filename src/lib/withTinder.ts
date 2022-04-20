/** @docs https://gist.github.com/rtt/10403467 */
import cache from 'memory-cache'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Tinder } from 'tinder'
import { log } from '.'
import f from './fb'
import t from './tinder'

export default (
    cb: (e: {
      req: NextApiRequest
      res: NextApiResponse
      t: ReturnType<typeof t>
      token?: string
      auth?: Tinder.AuthResponse
    }) => Promise<void>
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if ('clear' in req.query) {
      cache.clear()
    }

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=59'
    )

    try {
      if (!cache.get('tinder')) {
        cache.del(`tinder`)

        const token = await f()

        const auth = await t(token)<Tinder.AuthResponse>(
          'POST',
          '/v2/auth/login/facebook',
          { body: { token }, key: 'auth' }
        )

        if (!auth?.data?.api_token) {
          log('[ERROR]', auth)

          return res.status(401).json(auth)
        }

        cache.put('tinder', auth.data.api_token)
      }

      return cb({
        auth: cache.get('tinder'),
        req,
        res,
        t: t(cache.get('tinder')),
        token: cache.get('fb')
      })
    } catch (err: any) {
      log('[ERROR]', err)

      return res.status(500).json({
        message: err?.message,
        statusCode: 500
      })
    }
  }
