import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addProps} from 'ad-hok'

import {branchIfNullish, suppressUnlessProp} from '..'

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
  test('aliased as suppressUnlessProp()', () => {
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

    const testId = 'suppress-unless-prop'
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
})
