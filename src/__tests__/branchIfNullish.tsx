import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addProps} from 'ad-hok'

import {branchIfNullish} from '..'

describe('branchIfNullish()', () => {
  test('abort rendering when prop is undefined/null', () => {
    interface Props {
      x?: number | null
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfNullish('x'),
      addProps(({x}) => ({
        x: x + 3,
      })),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'branch-if-nullish'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={2} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('5')
    rerender(<Component x={null} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={undefined} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={0} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
  })
  test('accepts returns option', () => {
    interface Props {
      x?: number | null
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfNullish('x', {
        returns: ({testId}) => <div data-testid={testId}>aborted</div>,
      }),
      addProps(({x}) => ({
        x: x + 3,
      })),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'branch-if-nullish-returns'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('aborted')
    rerender(<Component x={2} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('5')
    rerender(<Component x={null} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('aborted')
    rerender(<Component x={undefined} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('aborted')
  })
  test('accepts array of prop names', () => {
    interface Props {
      x?: number | null
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfNullish(['x']),
      addProps(({x}) => ({
        x: x + 3,
      })),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'branch-if-nullish-array'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={2} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('5')
    rerender(<Component x={null} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={undefined} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
  })
  test('aborts rendering when any of the specified props are undefined/null', () => {
    interface Props {
      x?: number | null
      y?: number | null
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfNullish(['x', 'y']),
      addProps(({x, y}) => ({
        z: x + y,
      })),
      ({z, testId}) => <div data-testid={testId}>{z}</div>,
    )

    const testId = 'branch-if-nullish-multiple'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={2} y={3} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('5')
    rerender(<Component x={null} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={undefined} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={0} y={3} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
    rerender(<Component x={2} y={null} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
  })
})
