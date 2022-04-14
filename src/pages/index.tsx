import type { GridProps } from '@nextui-org/react'
import { Button, Card, Grid, Loading } from '@nextui-org/react'
import { Suspense, useEffect, useMemo, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import type { Tinder } from 'tinder'
import { Filter, Item } from '~/components'

const { FB_APP_ID } = process.env

const Placeholder = (props: GridProps) => (
  <Grid justify="center" sm={100} {...props}>
    <Card>
      <Loading size="xl" type="spinner" />
    </Card>
  </Grid>
)

const Inner = ({ accessToken, userID }: Partial<FBStatus['authResponse']>) => {
  const [filters, setFilters] = useState<Record<string, FilterType>>({
    distance: 1e3
  })

  const { data, mutate, setSize, size } = useSWRInfinite<{
    data: Tinder.MatchResponse
  }>((idx, prev) => {
    const args = new URLSearchParams()
    args.append('count', '20')
    args.append('u', `${userID}`)
    args.append('t', `${accessToken}`)

    if (prev && prev.data?.next_page_token) {
      args.append('page_token', prev.data.next_page_token)
    }

    if (!idx || prev) {
      return `/api/matches?${args.toString()}`
    }

    return null
  })

  const items = useMemo(
    () =>
      Array.isArray(data)
        ? data
            .flatMap(i => i?.data?.matches)
            .filter(i => !!i?.person?.photos?.length)
            .filter(i =>
              Object.entries(filters).every(([k, v]) =>
                typeof v === 'function'
                  ? v(i)
                  : (i?.[k] ?? i?.person?.[k] ?? v) === v
              )
            )
        : [],
    [data, filters]
  )

  console.log(filters.distance)

  return (
    <>
      <Filter {...{ filters, setFilters }} />

      {!items?.length ? (
        <Placeholder md={3} sm={6} xs={12} />
      ) : (
        <>
          <Suspense
            fallback={<Placeholder md={3} sm={6} xs={12} />}
            key={JSON.stringify(filters)}>
            {items?.map(i => (
              <Item
                key={i?.id}
                md={3}
                sm={6}
                xs={12}
                {...{ filters, item: i, mutate, setFilters }}
              />
            ))}
          </Suspense>
        </>
      )}

      {data?.[data.length - 1]?.data?.next_page_token && (
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

export type FilterType =
  | ((a: Tinder.Match) => boolean)
  | string
  | number
  | boolean
  | undefined
