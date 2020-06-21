import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addState} from 'ad-hok'

import {addLayoutEffectOnMount} from '..'

describe('addLayoutEffectOnMount()', () => {
  test('only fires effect on mount', () => {
    interface Props {
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addState('x', 'setX', 0),
      addLayoutEffectOnMount(({setX}) => () => {
        setX((x) => x + 1)
      }),
      ({x}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'effect-on-mount'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')
    rerender(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')
    rerender(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')
  })
})
