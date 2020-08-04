import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addProps} from 'ad-hok'

import {branchIfFalsy} from '..'

describe('branchIfFalsy()', () => {
  test('abort rendering when prop is falsy', () => {
    interface Props {
      x?: number | null
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfFalsy('x'),
      addProps(({x}) => ({
        x: x + 3,
      })),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'branch-if-falsy'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={2} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('5')
    rerender(<Component x={null} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={undefined} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={0} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
  })
  test('accepts returns option', () => {
    interface Props {
      x?: number | null
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfFalsy('x', {
        returns: ({testId}) => <div data-testid={testId}>aborted</div>,
      }),
      addProps(({x}) => ({
        x: x + 3,
      })),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'branch-if-falsy-returns'
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
      branchIfFalsy(['x']),
      addProps(({x}) => ({
        x: x + 3,
      })),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'branch-if-falsy-array'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={2} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('5')
    rerender(<Component x={null} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={undefined} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
  })
  test('type-narrows boolean prop', () => {
    interface Props {
      x?: boolean | null
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfFalsy('x'),
      addProps(({x}) => ({
        y: x && 'abc',
      })),
      addProps(({y}) => ({
        yUppercase: y.toUpperCase(),
      })),
      ({yUppercase, testId}) => <div data-testid={testId}>{yUppercase}</div>,
    )

    const testId = 'branch-if-falsy-boolean'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={true} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
    rerender(<Component x={null} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={undefined} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={false} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
  })
})
