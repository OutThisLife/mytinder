import cache from 'memory-cache'
import type { Tinder } from 'tinder'
import { withTinder } from '~/lib'

export default withTinder(async ({ req, res, t }) => {
  const { id } = req.query
  const k = `https://api.gotinder.com/updates?locale=en`
  const r = cache.get(k) as Tinder.MatchResponse

  if (r?.matches?.length) {
    cache.put(k, {
      ...r,
      matches: r.matches.filter(i => i?._id !== id)
    })
  }

  res.status(200).json(
    await t<Tinder.MatchResponse>('DELETE', `/user/matches/${id}`, {
      ttl: 10
    })
  )
})
