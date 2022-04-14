import type { CardProps } from '@nextui-org/react'
import { Card, Grid, Radio, Switch, Text } from '@nextui-org/react'
import type { Dispatch, SetStateAction } from 'react'
import type { FilterType } from '~/pages'

export const Filter = ({ filters, setFilters, ...props }: FilterProps) => (
  <Card
    css={{
      inset: '0 auto auto 0',
      position: 'fixed',
      w: 'auto',
      zIndex: 1e2
    }}
    shadow
    {...props}>
    <Card.Body>
      <Radio.Group
        css={{ textAlign: 'center', w: '100%' }}
        initialValue={0}
        onChange={e => setFilters(f => ({ ...f, gender: e }))}
        row
        size="xs">
        <Radio size="xs" value={0}>
          <Text size={10} transform="uppercase" weight="semibold">
            Male
          </Text>
        </Radio>

        <Radio size="xs" value={1}>
          <Text size={10} transform="uppercase" weight="semibold">
            Female
          </Text>
        </Radio>
      </Radio.Group>

      <Card.Footer css={{ p: 0, textAlign: 'center' }}>
        <Grid.Container gap={1}>
          <Grid>
            <Switch
              initialChecked={!!filters.is_super_like}
              onChange={({ target: { checked: e } }) =>
                setFilters(f => ({ ...f, is_super_like: e }))
              }
              shadow
            />
            <Text size={10} transform="uppercase" weight="semibold">
              Super Liked?
            </Text>
          </Grid>

          <Grid>
            <Switch
              initialChecked={filters?.distance === 20}
              onChange={({ target: { checked: e } }) =>
                setFilters(f => ({ ...f, distance: e ? 20 : 1e3 }))
              }
              shadow
            />
            <Text size={10} transform="uppercase" weight="semibold">
              near me
            </Text>
          </Grid>
        </Grid.Container>
      </Card.Footer>
    </Card.Body>
  </Card>
)

Filter.displayName = 'Filter'

interface FilterProps extends CardProps {
  filters: Record<string, unknown>
  setFilters: Dispatch<SetStateAction<Record<string, FilterType>>>
}

export default Filter
