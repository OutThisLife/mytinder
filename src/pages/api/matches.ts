import cache from 'memory-cache'
import type { Tinder } from 'tinder'
import { withTinder } from '~/lib'

export default withTinder(async ({ req, res, t }) => {
  if ('clear' in req.query) {
    cache.del(`https://api.gotinder.com/updates?locale=en`)
  }

  const r = await t<any, Tinder.MatchResponse>('POST', '/updates', {
    body: { last_activity_date: '' }
  })

  const x = Number(req.query?.x ?? 0)
  const y = Number(req.query?.y ?? 100)

  const matches = await Promise.all(
    r?.matches?.slice(x, x + y).map(async i => {
      await new Promise(fn => setTimeout(fn, 100))

      return {
        ...i,
        person: {
          ...i?.person,
          ...(await t<Tinder.UserResponse>('GET', `/user/${i?.person?._id}`))
            ?.results
        }
      }
    }) ?? []
  )

  res.status(200).json({ count: r?.matches?.length ?? 1e3, matches })
})
