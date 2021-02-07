import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addProps} from 'ad-hok'

import {branchIfPassesPredicate} from '..'

const isNumber = (val: any): val is number =>
  Object.prototype.toString.call(val) === '[object Number]'

describe('branchIfPassesPredicate()', () => {
  test('abort rendering when prop passes predicate', () => {
    interface Props {
      x: number | string
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfPassesPredicate('x', isNumber),
      addProps(({x}) => ({
        x: x.toUpperCase(),
      })),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'branch-if-passes-predicate'
    const {rerender} = render(<Component x="abc" testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
    rerender(<Component x={2} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
  })
  test('accepts returns option', () => {
    interface Props {
      x: number | string
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfPassesPredicate('x', isNumber, {
        returns: ({x, testId}) => (
          <div data-testid={testId}>aborted {x + 3}</div>
        ),
      }),
      addProps(({x}) => ({
        x: x.toUpperCase(),
      })),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'branch-if-passes-predicate-returns'
    const {rerender} = render(<Component x="abc" testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
    rerender(<Component x={2} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('aborted 5')
  })
})
