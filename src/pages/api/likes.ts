import type { Tinder } from 'tinder'
import { withTinder } from '~/lib'

export default withTinder(async ({ res, t }) => {
  res.status(200).json(await t<Tinder.User[]>('GET', `/v2/fast-match/count`))
})
