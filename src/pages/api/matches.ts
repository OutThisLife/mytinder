import cache from 'memory-cache'
import type { Tinder } from 'tinder'
import { withTinder } from '~/lib'

export default withTinder(async ({ req, res, t }) => {
  if ('clear' in req.query) {
    cache.clear()
  }

  res.status(200).json(
    await t<Tinder.MatchResponse>('GET', '/v2/matches', {
      body: { count: 10, ...req.query, req },
      ttl: 1e3 * 60 * 60
    })
  )
})
