import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax} from 'ad-hok'

import {addIsInitialRender} from '..'

describe('addIsInitialRender()', () => {
  test('exposes isInitialRender prop', () => {
    interface Props {
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addIsInitialRender,
      ({isInitialRender}) => (
        <div data-testid={testId}>{isInitialRender ? 'yes' : 'no'}</div>
      ),
    )

    const testId = 'is-initial-render'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('yes')
    rerender(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('no')
  })
})
