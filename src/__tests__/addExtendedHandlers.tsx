import React, {FC} from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addStateHandlers, addState} from 'ad-hok'

import {addExtendedHandlers} from '..'

describe('addExtendedHandlers()', () => {
  test('invokes extended handler along with existing handler', () => {
    interface Props {
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addStateHandlers(
        {
          x: 3,
        },
        {
          incrementXBy: ({x}) => (by: number) => ({
            x: x + by,
          }),
        },
      ),
      addState('xCopy', 'setXCopy', ({x}) => x),
      addExtendedHandlers({
        incrementXBy: ({x, setXCopy}) => (by: number) => {
          setXCopy(x + by)
        },
      }),
      ({x, xCopy, incrementXBy}) => (
        <div>
          <div data-testid={testId}>{x}</div>,
          <div data-testid={`${testId}-copy`}>{xCopy}</div>
          <button onClick={() => incrementXBy(2)}>increment</button>
        </div>
      ),
    )

    const testId = 'extended-handler'
    render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
    expect(screen.getByTestId(`${testId}-copy`)).toHaveTextContent('3')
    fireEvent.click(screen.getByText('increment'))
    expect(screen.getByTestId(testId)).toHaveTextContent('5')
    expect(screen.getByTestId(`${testId}-copy`)).toHaveTextContent('5')
  })
  test('ok with nonexistent handler name', () => {
    interface Props {
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addState('x', 'setX', 3),
      addExtendedHandlers({
        incrementXBy: ({x, setX}) => (by: number) => {
          setX(x + by)
        },
      }),
      ({x, incrementXBy}) => (
        <div>
          <div data-testid={testId}>{x}</div>,
          <button onClick={() => incrementXBy(2)}>increment copy</button>
        </div>
      ),
    )

    const testId = 'nonexistent-handler'
    render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
    fireEvent.click(screen.getByText('increment copy'))
    expect(screen.getByTestId(testId)).toHaveTextContent('5')
  })
})
