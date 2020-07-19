import React, {FC, createContext} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addProps, addContext} from 'ad-hok'

import {addContextProvider} from '..'

describe('addContextProvider()', () => {
  test('provides context value from prop', () => {
    const Context = createContext<
      | {
          x: number
        }
      | undefined
    >(undefined)

    interface ConsumerProps {
      testId: string
    }

    const Consumer: FC<ConsumerProps> = flowMax(
      addContext(Context, 'contextValue'),
      ({contextValue, testId}) => (
        <div data-testid={testId}>{contextValue!.x}</div>
      ),
    )

    interface Props {
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addProps({
        x: 3,
      }),
      addProps(
        ({x}) => ({
          contextValue: {x},
        }),
        ['x'],
      ),
      addContextProvider(Context, 'contextValue'),
      ({testId}) => <Consumer testId={testId} />,
    )

    const testId = 'add-context-provider'
    render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
  })
})
