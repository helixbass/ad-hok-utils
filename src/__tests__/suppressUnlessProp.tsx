import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addProps} from 'ad-hok'

import {suppressUnlessProp} from '..'

describe('suppressUnlessProp()', () => {
  test('abort rendering when prop is undefined/null', () => {
    interface Props {
      x?: number | null
      testId: string
    }

    const Component: FC<Props> = flowMax(
      suppressUnlessProp('x'),
      addProps(({x}) => ({
        x: x + 3,
      })),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'abort-undefined'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={2} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('5')
    rerender(<Component x={null} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={undefined} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
  })
})
