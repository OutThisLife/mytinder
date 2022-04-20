import cache from 'memory-cache'
import type { Tinder } from 'tinder'
import { log } from '.'

export default (token: string) =>
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
