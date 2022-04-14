import type { GridProps } from '@nextui-org/react'
import {
  Button,
  Card,
  Col,
  Divider,
  Grid,
  Row,
  styled,
  Text
} from '@nextui-org/react'
import Image from 'next/image'
import type { SetStateAction } from 'react'
import { useCallback } from 'react'
import type { Tinder } from 'tinder'

const StyledBody = styled(Card.Body, {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  maxWidth: '100%',
  overflow: 'overlay',
  placeContent: 'flex-start',
  placeItems: 'stretch'
} as any)

const getAge = (d: string) =>
  Math.floor((+new Date() - +new Date(d)) / 31557600000)

export const Item = ({
  item: { is_super_like, person, ...item },
  update = () => void null,
  ...props
}: ItemProps) => {
  const onClick = useCallback(async () => {
    try {
      const r = await (await fetch(`/api/unmatch?id=${item._id}`)).json()

      if (r.status === 200) {
        update(i => i.filter(i2 => i2.id !== item.id))
      }
    } catch (err) {
      console.error(err)
    }
  }, [item, update])

  return (
    <Grid {...props}>
      <Card hoverable>
        <Card.Header>
          <Col>
            <Text h2>
              <span>{person?.name}</span>{' '}
              <Text as="span" css={{ fontSize: '0.8em' }}>
                ({getAge(person?.birth_date)})
              </Text>
            </Text>

            <Text
              css={{ color: '$accents5' }}
              h5
              size={12}
              transform="uppercase">
              {is_super_like ? 'Super Like' : 'Like'}
            </Text>
          </Col>
        </Card.Header>

        {!!person?.photos?.length && (
          <StyledBody>
            {Array.from(person.photos ?? [])
              ?.sort((a, b) => (a?.rank || 0) - (b?.rank || 0))
              .map(i => (
                <div key={i?.id} style={{ flex: 'auto 0 0' }}>
                  <Image
                    alt={person?.name}
                    height={300}
                    loading="lazy"
                    objectFit="cover"
                    objectPosition="center top"
                    src={`${i?.processedFiles?.[0]?.url ?? i?.url}`}
                    width={300}
                  />
                </div>
              ))}
          </StyledBody>
        )}

        <Divider />

        <Card.Footer>
          <Row css={{ w: '100%' }} justify="space-between">
            <Button auto light>
              Tickle
            </Button>

            <Button auto color="error" {...{ onClick }}>
              Unmatch
            </Button>
          </Row>
        </Card.Footer>
      </Card>
    </Grid>
  )
}

export default Item

interface ItemProps extends GridProps {
  item: Tinder.Match
  update(v: SetStateAction<Tinder.Match[]>): void
}
