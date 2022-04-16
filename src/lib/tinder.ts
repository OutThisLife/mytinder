/** @docs https://gist.github.com/rtt/10403467 */
import cache from 'memory-cache'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Tinder } from 'tinder'

const { FB_TOKEN, FB_UID } = process.env

const log = (...args: any[]) => {
  const debug = 1

  if (debug) {
    console.log(...args)
  }
}

export const t =
  (token: string) =>
  async <T extends Record<string, any>, K = Tinder.Response<T>>(
    method = 'POST',
    p = '',
    {
      body = {},
      headers = {},
      ttl = 24 * 1e3 * 60 * 60
    }: {
      body?: Record<string, any>
      headers?: Record<string, any>
      ttl?: number
    } = {}
  ): Promise<K> => {
    const url = new URL(p, `https://api.gotinder.com/`)
    url.searchParams.append('locale', 'en')

    const args = {
      headers: {
        'User-agent': 'Tinder/7.5.3 (iPhone; iOS 10.3.2; Scale/2.00)',
        'X-Auth-Token': token,
        app_version: '6.9.4',
        'content-type': 'application/json',
        platform: 'ios',
        ...headers
      },
      method
    }

    if (method === 'GET') {
      Object.entries(body).forEach(([k, v]) => url.searchParams.append(k, v))
    } else {
      Object.assign(args, { body: JSON.stringify(body ?? {}) })
    }

    const k = url.toString()
    const cachable = /post|get/i.test(args.method)

    if (!cache.get(k)) {
      if (cachable) {
        log('[MISS]', k)
      } else {
        log(`[${args.method}]`, k)
      }

      const r = await fetch(k, args)

      try {
        const j = await r.json()

        if (cachable) {
          cache.put(k, j, ttl)
        }

        return j
      } catch (_) {
        return {
          data: {},
          status: r.status,
          statusText: r.statusText
        } as any as K
      }
    }

    log('[HIT]', k)

    return cache.get(k)
  }

export const withTinder =
  (
    cb: (e: {
      req: NextApiRequest
      res: NextApiResponse
      t: ReturnType<typeof t>
    }) => Promise<void>
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=59'
    )

    try {
      if (!cache.get('token')) {
        const auth = await t(
          `${req.query?.t ?? FB_TOKEN}`
        )<Tinder.AuthResponse>('POST', '/v2/auth/login/facebook', {
          body: {
            facebook_id: req?.query?.u ?? FB_UID,
            token: req.query?.t ?? FB_TOKEN
          }
        })

        if (!auth?.data?.api_token) {
          console.error('[ERROR]', auth)

          return res.status(401).json(auth)
        }

        cache.put('token', auth.data.api_token)
      }

      return cb({ req, res, t: t(cache.get('token')) })
    } catch (err: any) {
      console.error('[ERROR]', err)

      return res.status(500).json({
        message: err?.message,
        statusCode: 500
      })
    }
  }
