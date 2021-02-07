import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addProps} from 'ad-hok'

import {branchIfTruthy} from '..'

describe('branchIfTruthy()', () => {
  test('abort rendering when prop is truthy', () => {
    interface Props {
      x?: number | null
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfTruthy('x'),
      addProps(() => ({
        y: 'ABC',
      })),
      ({y, testId}) => <div data-testid={testId}>{y}</div>,
    )

    const testId = 'branch-if-truthy'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
    rerender(<Component x={2} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={null} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
    rerender(<Component x={undefined} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
    rerender(<Component x={0} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
  })
  test('accepts returns option', () => {
    interface Props {
      x?: number | null
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfTruthy('x', {
        returns: ({x, testId}) => <div data-testid={testId}>{x + 1}</div>,
      }),
      addProps(() => ({
        y: 'ABC',
      })),
      ({y, testId}) => <div data-testid={testId}>{y}</div>,
    )

    const testId = 'branch-if-truthy-returns'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
    rerender(<Component x={2} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
    rerender(<Component x={null} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
    rerender(<Component x={undefined} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
  })
  test('accepts array of prop names', () => {
    interface Props {
      x?: number | null
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfTruthy(['x']),
      addProps(() => ({
        y: 'ABC',
      })),
      ({y, testId}) => <div data-testid={testId}>{y}</div>,
    )

    const testId = 'branch-if-truthy-array'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
    rerender(<Component x={2} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={null} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
    rerender(<Component x={undefined} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
  })
  test('type-narrows boolean prop', () => {
    interface Props {
      x: boolean
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfTruthy('x'),
      addProps(({x}) => ({
        y: x || 'abc',
      })),
      addProps(({y}) => ({
        yUppercase: y.toUpperCase(),
      })),
      ({yUppercase, testId}) => <div data-testid={testId}>{yUppercase}</div>,
    )

    const testId = 'branch-if-truthy-boolean'
    const {rerender} = render(<Component x={true} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={false} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
  })
})
