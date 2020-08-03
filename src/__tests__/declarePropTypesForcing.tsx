import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addProps} from 'ad-hok'

import {declarePropTypesForcing} from '..'

describe('declarePropTypesForcing()', () => {
  test('instructs Typescript to force the given prop types', () => {
    interface Props {
      foo: number
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addProps({
        foo: 'abc',
      }),
      declarePropTypesForcing<{
        foo: string
      }>(),
      addProps(({foo}) => ({
        fooUppercase: foo.toUpperCase(),
      })),
      ({fooUppercase, testId}) => (
        <div data-testid={testId}>{fooUppercase}</div>
      ),
    )

    const testId = 'declare-prop-types-forcing'
    render(<Component foo={2} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
  })
})
