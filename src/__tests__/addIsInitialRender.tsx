import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {
  flowMax,
  addEffect,
  addStateHandlers,
  addProps,
  addLayoutEffect,
} from 'ad-hok'

import {addIsInitialRender} from '..'

describe('addIsInitialRender()', () => {
  test('exposes isInitialRender prop', () => {
    interface Props {
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addStateHandlers(
        {
          numInitialTriggers: 0,
          numInitialLayoutTriggers: 0,
        },
        {
          triggerInitial: ({numInitialTriggers}) => () => ({
            numInitialTriggers: numInitialTriggers + 1,
          }),
          triggerInitialLayout: ({numInitialLayoutTriggers}) => () => ({
            numInitialLayoutTriggers: numInitialLayoutTriggers + 1,
          }),
        },
      ),
      addIsInitialRender,
      addEffect(({triggerInitial, isInitialRender}) => () => {
        if (isInitialRender) triggerInitial()
      }),
      addLayoutEffect(({isInitialRender, triggerInitialLayout}) => () => {
        if (isInitialRender) triggerInitialLayout()
      }),
      addProps(
        ({isInitialRender}) => ({
          x: isInitialRender ? 1 : 2,
        }),
        [],
      ),
      ({numInitialTriggers, x, numInitialLayoutTriggers}) => (
        <div data-testid={testId}>
          {numInitialTriggers} {x} {numInitialLayoutTriggers}
        </div>
      ),
    )

    const testId = 'is-initial-render'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1 1 1')
    rerender(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1 1 1')
  })
})
