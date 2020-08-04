import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, branch, returns, addProps} from 'ad-hok'
import {isNumber} from 'lodash'

import {declarePropTypesNarrowing} from '..'

describe('declarePropTypesNarrowing()', () => {
  test('instructs Typescript to narrow the given prop types', () => {
    interface Props {
      foo: {
        bar?: number | string | null
      }
      testId: string
    }

    const Component: FC<Props> = flowMax(
      branch(
        ({foo: {bar}}) => bar == null || isNumber(bar),
        returns(({testId}) => <div data-testid={testId}>aborted</div>),
      ),
      declarePropTypesNarrowing<{
        foo: {
          bar: string
        }
      }>(),
      addProps(({foo: {bar}}) => ({
        barUppercase: bar.toUpperCase(),
      })),
      ({barUppercase, testId}) => (
        <div data-testid={testId}>{barUppercase}</div>
      ),
    )

    const testId = 'declare-prop-types-narrowing'
    const {rerender} = render(<Component foo={{}} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('aborted')
    rerender(<Component foo={{bar: 1}} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('aborted')
    rerender(<Component foo={{bar: 'abc'}} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
  })
})
