/** @docs https://gist.github.com/rtt/10403467 */
import type { Tinder } from 'tinder'
import { withTinder } from '~/lib'

export default withTinder(async ({ auth, req, res, t }) =>
  res.status(200).json(
    await t<Tinder.MatchResponse>('DELETE', `/user/matches/${req.query?.id}`, {
      headers: { 'X-Auth-Token': auth?.data?.api_token },
      ttl: 10
    })
  )
)
