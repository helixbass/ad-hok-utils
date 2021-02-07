import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addProps} from 'ad-hok'

import {branchIfFailsPredicate} from '..'

const isNumber = (val: any): val is number =>
  Object.prototype.toString.call(val) === '[object Number]'

describe('branchIfFailsPredicate()', () => {
  test('abort rendering when prop fails predicate', () => {
    interface Props {
      x: number | string
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfFailsPredicate('x', isNumber),
      addProps(({x}) => ({
        x: x + 3,
      })),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'branch-if-fails-predicate'
    const {rerender} = render(<Component x="abc" testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={2} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('5')
  })
  test('accepts returns option', () => {
    interface Props {
      x: number | string
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfFailsPredicate('x', isNumber, {
        returns: ({x, testId}) => (
          <div data-testid={testId}>aborted {x.toUpperCase()}</div>
        ),
      }),
      addProps(({x}) => ({
        x: x + 3,
      })),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'branch-if-fails-predicate-returns'
    const {rerender} = render(<Component x="abc" testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('aborted ABC')
    rerender(<Component x={2} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('5')
  })
})
