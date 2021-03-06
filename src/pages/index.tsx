import { Button, Card, Grid } from '@nextui-org/react'
import type { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'
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
        .sort(
          (a, b) =>
            +new Date(a.person?.distance_mi) - +new Date(b.person?.distance_mi)
        )
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => ({
  props: {
    fallback: {
      '/api/matches/': await (
        await import('./api/matches')
      ).default(req as NextApiRequest, res as NextApiResponse)
    }
  }
})
