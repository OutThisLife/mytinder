import { Button, Card, Grid } from '@nextui-org/react'
import { Suspense } from 'react'
import useSWR, { SWRConfig } from 'swr'
import type { Tinder } from 'tinder'
import { Item } from '~/components'

const Inner = () => {
  const { data, mutate } = useSWR<Tinder.MatchResponse>(`/api/matches/`)

  const remove = async (id: string) => {
    try {
      mutate(
        d => ({
          count: d?.matches?.length ?? 0,
          matches: d?.matches?.filter(i => i.id !== id) ?? []
        }),
        { revalidate: false }
      )

      await fetch(`/api/unmatch/?id=${id}`)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <Suspense fallback={null}>
        {!!data?.matches?.length && (
          <Card
            css={{
              inset: 'auto 1rem 1rem auto',
              position: 'fixed',
              w: 'auto',
              zIndex: 1e3
            }}
            shadow>
            <Button
              auto
              color="error"
              disabled
              onClick={() =>
                data?.matches?.map(i => i?._id).forEach(remove.bind(null))
              }>
              Unmatch All ({data?.matches?.length})
            </Button>
          </Card>
        )}
      </Suspense>

      {(data?.matches ?? [])
        .filter(i => i)
        .sort((a, b) => +new Date(b.created_date) - +new Date(a.created_date))
        .map(i => (
          <Suspense fallback={null} key={i._id}>
            <Item md={3} sm={6} xs={12} {...{ remove, ...i }} />
          </Suspense>
        ))}
    </>
  )
}

export default function Index({
  fallback
}: {
  fallback: Tinder.MatchResponse
}) {
  return (
    <Grid.Container gap={2}>
      <SWRConfig
        value={{
          fallback,
          fetcher: async k => (await fetch(k)).json(),
          suspense: true
        }}>
        <Suspense fallback={null}>
          <Inner />
        </Suspense>
      </SWRConfig>
    </Grid.Container>
  )
}

export const getStaticProps = async () => {
  console.log(`${process.env.HOSTNAME ?? 'http://localhost:3000'}/api/matches/`)

  return {
    props: {
      fallback: {
        '/api/matches/': await (
          await fetch(
            `${process.env.HOSTNAME ?? 'http://localhost:3000'}/api/matches/`
          )
        ).json()
      }
    }
  }
}
