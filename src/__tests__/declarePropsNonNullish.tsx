import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, branch, returns, addProps} from 'ad-hok'

import {declarePropsNonNullish} from '..'

describe('declarePropsNonNullish()', () => {
  test('instructs Typescript that the given props are non-nullish', () => {
    interface Props {
      foo?: string | null | undefined
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branch(
        ({foo}) => foo == null,
        returns(({testId}) => <div data-testid={testId}>nullish</div>),
      ),
      declarePropsNonNullish(['foo']),
      addProps(({foo}) => ({
        fooUppercase: foo.toUpperCase(),
      })),
      ({fooUppercase, testId}) => (
        <div data-testid={testId}>{fooUppercase}</div>
      ),
    )

    const testId = 'declare-props-non-nullish'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('nullish')
    rerender(<Component foo={null} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('nullish')
    rerender(<Component foo="abc" testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
  })

  test('accepts a single non-array prop name', () => {
    interface Props {
      foo?: string | null | undefined
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branch(
        ({foo}) => foo == null,
        returns(({testId}) => <div data-testid={testId}>nullish</div>),
      ),
      declarePropsNonNullish('foo'),
      addProps(({foo}) => ({
        fooUppercase: foo.toUpperCase(),
      })),
      ({fooUppercase, testId}) => (
        <div data-testid={testId}>{fooUppercase}</div>
      ),
    )

    const testId = 'declare-props-non-nullish-single'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('nullish')
    rerender(<Component foo={null} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('nullish')
    rerender(<Component foo="abc" testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
  })
})
