import React, {FC} from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax} from 'ad-hok'

import {addReducerOverProps} from '..'

describe('addReducerOverProps()', () => {
  test('exposes reducer over props', () => {
    interface Props {
      x: number
      testId: string
    }

    interface ReducerState {
      y: number
    }

    type ReducerAction =
      | {type: 'incrementByX'}
      | {type: 'incrementByAmount'; amount: number}

    const Component: FC<Props> = flowMax(
      addReducerOverProps(
        ({x}) => (state: ReducerState, action: ReducerAction) => {
          switch (action.type) {
            case 'incrementByX':
              return {
                ...state,
                y: state.y + x,
              }
            case 'incrementByAmount':
              return {
                ...state,
                y: state.y + action.amount,
              }
          }
        },
        {
          y: 1,
        },
      ),
      ({x, y, dispatch}) => (
        <div>
          <div data-testid={testId}>{x}</div>
          <div data-testid={`${testId}-y`}>{y}</div>
          <button onClick={() => dispatch({type: 'incrementByX'})}>
            increment by X
          </button>
          <button
            onClick={() => dispatch({type: 'incrementByAmount', amount: 2})}
          >
            increment by amount
          </button>
        </div>
      ),
    )

    const testId = 'reducer-over-props'
    const {rerender} = render(<Component x={3} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
    expect(screen.getByTestId(`${testId}-y`)).toHaveTextContent('1')
    fireEvent.click(screen.getByText('increment by X'))
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
    expect(screen.getByTestId(`${testId}-y`)).toHaveTextContent('4')
    fireEvent.click(screen.getByText('increment by amount'))
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
    expect(screen.getByTestId(`${testId}-y`)).toHaveTextContent('6')
    rerender(<Component x={4} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('4')
    expect(screen.getByTestId(`${testId}-y`)).toHaveTextContent('6')
    fireEvent.click(screen.getByText('increment by X'))
    expect(screen.getByTestId(testId)).toHaveTextContent('4')
    expect(screen.getByTestId(`${testId}-y`)).toHaveTextContent('10')
  })
})
