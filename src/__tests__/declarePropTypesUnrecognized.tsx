import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addProps, SimplePropsAdder} from 'ad-hok'

import {declarePropTypesUnrecognized, removeProps} from '..'

describe('declarePropTypesUnrecognized()', () => {
  test('instructs Typescript to set the given prop types for unrecognized props', () => {
    type AddX = SimplePropsAdder<{
      x: number
    }>

    const addX: AddX = addProps({
      x: 1,
      y: 2,
    })

    interface Props {
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addX,
      declarePropTypesUnrecognized<{
        y: number
      }>(),
      removeProps(['y']),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'declare-prop-types-unrecognized'
    render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')
  })
})
