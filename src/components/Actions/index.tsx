import type { CardProps } from '@nextui-org/react'
import { Button, Card } from '@nextui-org/react'
import { useCallback } from 'react'
import type { KeyedMutator } from 'swr'
import type { Tinder } from 'tinder'

export const Actions = ({ mutate, items = [], ...props }: ActionsProps) => {
  const onClick = useCallback(async () => {
    try {
      await Promise.all(
        items.map(async i => {
          await new Promise(fn => setTimeout(fn, 100))
          await fetch(`/api/unmatch?id=${i?._id}`)
        })
      )

      await mutate()
    } catch (err) {
      console.error(err)
    }
  }, [items])

  return (
    <Card
      css={{
        inset: '0 auto auto 0',
        position: 'fixed',
        w: 'auto',
        zIndex: 1e2
      }}
      shadow
      {...props}>
      <Button auto color="error" {...{ onClick }}>
        Unmatch All ({items.length})
      </Button>
    </Card>
  )
}

Actions.displayName = 'Actions'

interface ActionsProps extends CardProps {
  items?: Tinder.Match[]
  mutate: KeyedMutator<Tinder.MatchResponse[]>
}

export default Actions
