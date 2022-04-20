import { withTinder } from '~/lib'

export default withTinder(async ({ auth, res, token }) =>
  res.status(200).json({ auth, token })
)
