import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addState, addEffect} from 'ad-hok'

import {addPropTrackingRef} from '..'

describe('addPropTrackingRef()', () => {
  test('ref prop tracks given prop', () => {
    interface Props {
      x: number
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addPropTrackingRef('x', 'xRef'),
      addState('refValue', 'setRefValue', null as number | null),
      addEffect(({setRefValue, xRef}) => () => {
        setRefValue(xRef.current)
      }),
      ({refValue, testId}) => <div data-testid={testId}>{refValue}</div>,
    )

    const testId = 'track-prop-value'
    const {rerender} = render(<Component x={2} testId={testId} />)
    expect(screen.queryByTestId(testId)).toHaveTextContent('2')
    rerender(<Component x={4} testId={testId} />)
    expect(screen.queryByTestId(testId)).toHaveTextContent('4')
  })
})
