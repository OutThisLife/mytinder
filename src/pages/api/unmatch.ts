import type { Tinder } from 'tinder'
import { withTinder } from '~/lib'

export default withTinder(async ({ req, res, t }) =>
  res.status(200).json(
    await t<Tinder.MatchResponse>('DELETE', `/user/matches/${req.query?.id}`, {
      ttl: 10
    })
  )
)
