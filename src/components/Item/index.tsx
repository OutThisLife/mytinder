import type { GridProps } from '@nextui-org/react'
import { Button, Card, Col, Grid, Link, Row, Text } from '@nextui-org/react'
import { useCallback } from 'react'
import type { KeyedMutator } from 'swr'
import type { Tinder } from 'tinder'

const getAge = (d: string) =>
  Math.floor((+new Date() - +new Date(d)) / 31557600000)

export const Item = ({
  item: { _id: id, is_super_like, person },
  mutate,
  ...props
}: ItemProps) => {
  const onClick = useCallback(async () => {
    try {
      console.log('unmatch', id)
      await fetch(`/api/unmatch?id=${id}`)
      await mutate()
    } catch (err) {
      console.error(err)
    }
  }, [id])

  return (
    <Grid {...props}>
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
                {person?.city?.name}
                {person?.hide_distance ||
                  ` - ${person?.distance_mi} miles away`}
              </Text>
            </Col>

            <Col>
              <Text color="#d1d1d1" size={12}>
                <Link href={`/api/user?id=${person?._id}`} target="_blank">
                  Profile
                </Link>
                <br />
                {is_super_like ? 'Super' : 'Liked'}
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
  mutate: KeyedMutator<Tinder.MatchResponse[]>
}

export default Item
