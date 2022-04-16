import type { GridProps } from '@nextui-org/react'
import { Button, Card, Grid, Loading } from '@nextui-org/react'
import { Suspense, useEffect, useMemo, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import type { Tinder } from 'tinder'
import { Actions, Item } from '~/components'

const { FB_APP_ID } = process.env

const Placeholder = (props: GridProps) => (
  <Grid justify="center" sm={100} {...props}>
    <Card>
      <Loading size="xl" type="spinner" />
    </Card>
  </Grid>
)

const Inner = ({ accessToken, userID }: Partial<FBStatus['authResponse']>) => {
  const { data, mutate, setSize, size } = useSWRInfinite<Tinder.MatchResponse>(
    (idx, prev) => {
      const args = new URLSearchParams()

      const per = 1e3

      const max = !prev
        ? 10
        : Math.ceil(Number(prev?.count ?? prev?.matches?.length) / per)

      args.append('y', `${per}`)

      if (idx < max) {
        args.append('x', `${idx * per}`)
      }

      if (!idx || prev) {
        return `/api/matches?${args.toString()}`
      }

      return null
    },
    async k =>
      (
        await fetch(k, {
          headers: {
            'X-Access-Token': `${accessToken}`,
            'X-User-ID': `${userID}`
          }
        })
      ).json(),
    {
      persistSize: true,
      revalidateFirstPage: false
    }
  )

  const full = useMemo(
    () => (Array.isArray(data) ? data.flatMap(i => i?.matches) : []),
    [data]
  )

  const items = useMemo(() => {
    const s = {
      f0: (i: Tinder.Match) =>
        i?.hide_distance
          ? i?.person?.city?.name === 'Minneapolis'
          : i?.person?.distance_mi <= 25,

      f1: (i: Tinder.Match) =>
        i?.hide_distance
          ? i?.person?.city?.name !== 'Minneapolis'
          : i?.person?.distance_mi > 25
    }

    return Array.from(full)
      .filter(s.f0)
      .sort(
        (a, b) => (a?.person?.distance_mi ?? 0) - (b?.person?.distance_mi ?? 0)
      )
  }, [full])

  return (
    <>
      <Actions {...{ items, mutate }} />

      {!full?.length ? (
        <Placeholder md={3} sm={6} xs={12} />
      ) : (
        <>
          <Suspense fallback={<Placeholder md={3} sm={6} xs={12} />}>
            {items?.map(i => (
              <Item
                key={i?.id}
                md={3}
                sm={6}
                xs={12}
                {...{ item: i, mutate }}
              />
            ))}
          </Suspense>
        </>
      )}

      {full.length < (data?.[0]?.count ?? 1e3) && (
        <Grid justify="center" sm={100}>
          <Button
            color="gradient"
            css={{ w: '100%' }}
            onClick={() => setSize(size + 1)}
            rounded
            shadow
            size="xl">
            Load More
          </Button>
        </Grid>
      )}
    </>
  )
}

export default function Index() {
  const [user, setUser] = useState<Partial<FBStatus['authResponse']> | null>({})

  useEffect(() => {
    if (!('browser' in process) || user?.accessToken) {
      return
    }

    const handle = (e: FBStatus) => {
      if (e?.status === 'connected') {
        window.FB?.Event.unsubscribe('auth.statusChange', handle)
        setUser(e.authResponse)
      } else {
        window.FB?.login(() => void null, {
          scope: ['email', 'public_profile'].join(',')
        })
      }
    }

    window.FB?.Event.subscribe('auth.statusChange', handle)

    window.requestAnimationFrame(() =>
      window.FB?.init({
        appId: FB_APP_ID,
        cookie: true,
        status: true,
        version: 'v13.0',
        xfbml: true
      })
    )

    return () =>
      void (
        'browser' in process &&
        window.FB &&
        window.FB?.Event.unsubscribe('auth.statusChange', handle)
      )
  }, [user?.accessToken])

  return (
    <Grid.Container css={{ padding: 10 }} gap={2} justify="center">
      <Grid sm={100} />

      <Inner {...user} />

      <Grid sm={100} />
    </Grid.Container>
  )
}
