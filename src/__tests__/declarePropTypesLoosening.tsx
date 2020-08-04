import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addProps} from 'ad-hok'
import {isString} from 'lodash'

import {declarePropTypesLoosening} from '..'

describe('declarePropTypesLoosening()', () => {
  test('instructs Typescript to loosen the given prop types', () => {
    interface Props {
      foo: number
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addProps(({foo}) => ({
        foo: foo === 1 ? 'abc' : foo,
      })),
      declarePropTypesLoosening<{
        foo: number | string
      }>(),
      ({foo, testId}) => (
        <div data-testid={testId}>
          {isString(foo) ? foo.toUpperCase() : foo}
        </div>
      ),
    )

    const testId = 'declare-prop-types-loosening'
    const {rerender} = render(<Component foo={1} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('ABC')
    rerender(<Component foo={2} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('2')
  })
})
