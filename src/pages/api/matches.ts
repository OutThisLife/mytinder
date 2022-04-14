import cache from 'memory-cache'
import type { Tinder } from 'tinder'
import { withTinder } from '~/lib'

export default withTinder(async ({ auth, req, res, t }) => {
  if (req.query?.clear) {
    cache.clear()
  }

  res.status(200).json(
    await t<Tinder.MatchResponse>('GET', '/v2/matches', {
      body: { count: req?.query?.count ?? 10 },
      headers: { 'X-Auth-Token': auth?.data?.api_token },
      ttl: 1000 * 60 * 60
    })
  )
})
