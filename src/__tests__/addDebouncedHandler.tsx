import React, {FC} from 'react'
import {render, screen, waitFor, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addState, addHandlers} from 'ad-hok'

import {addDebouncedHandler} from '..'

describe('addDebouncedHandler()', () => {
  test('debounces existing handler', async () => {
    interface Props {
      x: number
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addState('flag', 'setFlag', false),
      addHandlers({
        logX: ({x, setFlag}) => (message: string) => {
          console.log(`${x} ${message}`)
          setFlag(true)
        },
      }),
      addDebouncedHandler(500, 'logX'),
      ({flag, logX, testId}) => (
        <div>
          <div data-testid={testId}>{flag && 'called'}</div>
          <button onClick={() => logX('hello')}>log</button>
        </div>
      ),
    )

    jest.spyOn(console, 'log').mockImplementation(() => {})

    const testId = 'add-debounced-handler'
    const {rerender} = render(<Component x={3} testId={testId} />)
    fireEvent.click(screen.getByText('log'))
    rerender(<Component x={5} testId={testId} />)
    expect(console.log).toHaveBeenCalledTimes(0)
    expect(screen.getByTestId(testId)).toBeEmptyDOMElement()
    await waitFor(() => screen.getByText('called'))
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledWith('5 hello')
  })
})
