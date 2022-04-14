import type { GridProps } from '@nextui-org/react'
import { Card, Grid, Loading } from '@nextui-org/react'
import { Suspense, useEffect, useState } from 'react'
import useSWR from 'swr'
import type { Tinder } from 'tinder'
import { Item } from '~/components'

const { FB_APP_ID } = process.env

const Placeholder = (props: GridProps) => (
  <Grid css={{ textAlign: 'center' }} sm={100} {...props}>
    <Card>
      <Loading size="xl" type="spinner" />
    </Card>
  </Grid>
)

const Inner = ({
  pageToken,
  userID
}: {
  userID?: string
  pageToken?: string
}) => {
  const [items, update] = useState<Tinder.Match[]>([])

  const { data, isValidating } = useSWR<{ data: Tinder.MatchResponse }>(
    userID
      ? `/api/matches?${new URLSearchParams({
          count: 100,
          pageToken
        } as any).toString()}`
      : null
  )

  useEffect(
    () =>
      void !isValidating &&
      update(
        Array.from(data?.data?.matches ?? [])
          .filter(i => !!i?.person?.photos?.length)
          .sort((a, b) => +b?.is_super_like - +a?.is_super_like)
      ),
    [data, isValidating]
  )

  return (
    <>
      {isValidating || !items?.length ? (
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
                {...{ item: i, update }}
              />
            ))}
          </Suspense>

          {data?.data?.next_page_token && (
            <Inner
              key={data?.data?.next_page_token}
              {...{ pageToken: data?.data?.next_page_token, userID }}
            />
          )}
        </>
      )}
    </>
  )
}

export default function Index() {
  const [user, setUser] = useState<FBStatus['authResponse'] | null>()

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

      {user?.accessToken ? <Inner {...user} /> : <Placeholder />}

      <Grid sm={100} />
    </Grid.Container>
  )
}
