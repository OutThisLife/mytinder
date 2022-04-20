/** @docs https://gist.github.com/rtt/10403467 */
import cache from 'memory-cache'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Tinder } from 'tinder'

const debug = false

const log = (...args: any[]) => debug && console.log(...args)

const t =
  (token: string) =>
  async <T extends Record<string, any>, K = Tinder.Response<T>>(
    method = 'POST',
    p = '',
    {
      body = {},
      headers = {},
      ttl = 24 * 1e3 * 60 * 60,
      key
    }: {
      body?: Record<string, any>
      headers?: Record<string, any>
      ttl?: number
      key?: string
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

    const k = `${key ?? url.toString()}`
    const cachable = /post|get/i.test(args.method)

    if (!cache.get(k)) {
      if (cachable) {
        log('[MISS]', k)
      } else {
        log(`[${args.method}]`, k)
      }

      const r = await fetch(url.toString(), args)

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

const f = async (): Promise<string> => {
  if (!cache.get('fb')) {
    const puppeteer = await import('puppeteer')
    const browser = await puppeteer.launch({ headless: true })

    try {
      const page = await browser.newPage()

      await page.goto(
        `https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token`
      )

      await page.click('#email')
      await page.keyboard.type(`${process.env.FB_EMAIL}`)

      await page.click('#pass')
      await page.keyboard.type(`${process.env.FB_PASS}`)

      await page.click('#loginbutton')
      await page.waitForNavigation()

      const url = new URL(page.url())

      if (!url.pathname.endsWith('login_success.html')) {
        throw new Error('Login failed')
      }

      cache.put(
        'fb',
        new URLSearchParams(url.hash.split('#')?.pop())?.get('access_token'),
        1e3 * 60 * 60 * 24
      )
    } catch (err) {
      log(err)
    } finally {
      await browser.close()
    }
  }

  return cache.get('fb')
}

export const withTinder =
  (
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
      cache.del(`tinder`)
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
