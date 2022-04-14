import type { GridProps } from '@nextui-org/react'
import { Button, Card, Col, Grid, Row, Text } from '@nextui-org/react'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyedMutator } from 'swr'
import useSWR from 'swr'
import type { Tinder } from 'tinder'
import type { FilterType } from '~/pages'

const getAge = (d: string) =>
  Math.floor((+new Date() - +new Date(d)) / 31557600000)

export const Item = ({
  item: { _id: id, is_super_like, person, ...item },
  mutate,
  setFilters,
  ...props
}: ItemProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, set] = useState<boolean>(() => false)

  const { data } = useSWR<Tinder.UserResponse>(
    visible ? `/api/user?id=${person?._id}` : null
  )

  const onClick = useCallback(async () => {
    try {
      await fetch(`/api/unmatch?id=${id}`)

      mutate(async (r = []) =>
        r.map(i => ({
          ...i,
          data: {
            ...i.data,
            matches: i?.data?.matches?.filter(i2 => i2?._id !== id)
          }
        }))
      )
    } catch (err) {
      console.error(err)
    }
  }, [id])

  useEffect(() => {
    if (!('browser' in process || ref.current instanceof HTMLElement)) {
      return
    }

    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (set(true), io.disconnect())
    ) as IntersectionObserver

    io.observe(ref.current as HTMLElement)

    return () => io.disconnect()
  }, [])

  useEffect(
    () =>
      void data?.results &&
      setFilters(r => ({
        ...r,
        [id]: function () {
          return (data?.results?.distance_mi ?? 1) <= (this?.distance ?? 1e3)
        }
      })),
    [id, data?.results]
  )

  return (
    <Grid {...{ ref, ...props }}>
      <Card cover>
        {!!person?.photos?.length && (
          <Card.Body
            css={{
              bg: '$black',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              h: '100%',
              maxWidth: '100%',
              overflow: 'overlay',
              placeContent: 'flex-start',
              placeItems: 'stretch'
            }}>
            {person?.photos?.map(i => (
              <div key={i?.id} style={{ flex: 'auto 0 0' }}>
                <Card.Image
                  alt={person?.name}
                  autoResize
                  height={300}
                  loading="lazy"
                  objectFit="cover"
                  showSkeleton
                  src={`${i?.processedFiles?.[0]?.url ?? i?.url}`}
                  width={300}
                />
              </div>
            ))}
          </Card.Body>
        )}

        <Card.Footer
          blur
          css={{
            bgBlur: '#070808',
            bottom: 0,
            position: 'absolute',
            zIndex: 1
          }}>
          <Row align="center">
            <Col>
              <Text color="#d1d1d1" size={20} weight="semibold">
                <span>{person?.name}</span> ({getAge(person?.birth_date)})
              </Text>

              <Text color="#d1d1d1" size={12}>
                {is_super_like ? 'Super' : 'Liked'} &mdash;{' '}
                {data?.results?.distance_mi} miles away
              </Text>
            </Col>

            <Col>
              <Row justify="flex-end">
                <Button auto color="error" flat rounded {...{ onClick }}>
                  <Text
                    css={{ color: 'inherit' }}
                    size={12}
                    transform="uppercase"
                    weight="bold">
                    Unmatch
                  </Text>
                </Button>
              </Row>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </Grid>
  )
}

interface ItemProps extends GridProps {
  item: Tinder.Match
  mutate: KeyedMutator<{ data: Tinder.MatchResponse }[]>
  setFilters: Dispatch<SetStateAction<Record<string, FilterType>>>
}

export default Item
