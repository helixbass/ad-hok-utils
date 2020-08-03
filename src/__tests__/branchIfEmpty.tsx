import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addProps} from 'ad-hok'

import {branchIfEmpty} from '..'

describe('branchIfEmpty()', () => {
  test('abort rendering when array prop is empty', () => {
    interface Props {
      x?: number[] | null
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfEmpty('x'),
      addProps(({x}) => ({
        x: x.map((item) => item + 3),
      })),
      ({x, testId}) => <div data-testid={testId}>{x.join(',')}</div>,
    )

    const testId = 'branch-if-empty'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={[2, 3]} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('5,6')
    rerender(<Component x={null} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={undefined} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={[]} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
  })
  test('accepts returns option', () => {
    interface Props {
      x?: number[] | null
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfEmpty('x', {
        returns: ({testId}) => <div data-testid={testId}>aborted</div>,
      }),
      addProps(({x}) => ({
        x: x.map((item) => item + 3),
      })),
      ({x, testId}) => <div data-testid={testId}>{x.join(',')}</div>,
    )

    const testId = 'branch-if-empty-returns'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('aborted')
    rerender(<Component x={[2, 3]} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('5,6')
    rerender(<Component x={null} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('aborted')
    rerender(<Component x={undefined} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('aborted')
  })
  test('accepts array of prop names', () => {
    interface Props {
      x?: number[] | null
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfEmpty(['x']),
      addProps(({x}) => ({
        x: x.map((item) => item + 3),
      })),
      ({x, testId}) => <div data-testid={testId}>{x.join(',')}</div>,
    )

    const testId = 'branch-if-empty-array-prop-names'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={[2, 3]} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('5,6')
    rerender(<Component x={null} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={undefined} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
  })
  test('abort rendering when object prop is empty', () => {
    interface Props {
      x?: {
        [key: string]: number
      } | null
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branchIfEmpty('x'),
      addProps(({x}) => ({
        keys: Object.keys(x),
      })),
      ({keys, testId}) => <div data-testid={testId}>{keys.join(',')}</div>,
    )

    const testId = 'branch-if-empty'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={{y: 2, z: 3}} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('y,z')
    rerender(<Component x={null} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={undefined} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Component x={{}} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
  })
})
