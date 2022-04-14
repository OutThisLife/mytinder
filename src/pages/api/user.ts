import type { Tinder } from 'tinder'
import { withTinder } from '~/lib'

export default withTinder(async ({ req, res, t }) => {
  res.status(200).json(await t<Tinder.User[]>('GET', `/user/${req.query?.id}`))
})
