import type { GridProps } from '@nextui-org/react'
import { Button, Card, Col, Grid, Link, Row, Text } from '@nextui-org/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { Tinder } from 'tinder'

dayjs.extend(relativeTime)

export const Item = ({
  _id: id,
  created_date: date,
  is_super_like,
  md,
  person,
  remove,
  sm,
  xs
}: ItemProps) => (
  <Grid {...{ md, sm, xs }}>
    <Card
      clickable
      cover
      hoverable
      onClick={() => window.open(`//tinder.com/app/messages/${id}`, '_blank')}
      shadow>
      <Card.Header
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
          inset: '0 0 auto auto',
          placeContent: 'flex-end',
          placeItems: 'flex-end',
          position: 'absolute'
        }}>
        <Button auto color="error" flat onClick={() => remove(id)} rounded>
          <Text
            css={{ color: 'inherit' }}
            size={12}
            transform="uppercase"
            weight="bold">
            Unmatch
          </Text>
        </Button>
      </Card.Header>

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
                width={200}
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
            <Link href={`//tinder.com/app/messages/${id}`} target="_blank">
              <Text color="#d1d1d1" size={20} weight="semibold">
                <span>{person?.name}</span> (
                {dayjs(person?.birth_date)
                  .fromNow()
                  .replace(/[^0-9.]/g, '')}
                )
              </Text>
            </Link>
          </Col>

          <Col>
            <Row css={{ textAlign: 'right' }} justify="flex-end">
              <Text color="#d1d1d1" size={12}>
                {is_super_like ? 'Super' : 'Matched'} {dayjs().to(date)}
                <br />
                {person?.city?.name ?? 'N/A'}
                {person?.hide_distance ||
                  ` - ${person?.distance_mi} miles away`}
                <br />
              </Text>
            </Row>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  </Grid>
)

interface ItemProps extends Tinder.Match, Omit<GridProps, 'id'> {
  remove(id: string): Promise<void>
}

export default Item
