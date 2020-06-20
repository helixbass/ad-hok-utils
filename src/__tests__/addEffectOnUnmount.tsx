import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax} from 'ad-hok'

import {addEffectOnUnmount} from '..'

describe('addEffectOnUnmount()', () => {
  test('runs callback when component unmounts', async () => {
    interface Props {
      x: number
      testId: string
    }

    jest.spyOn(console, 'log').mockImplementation(() => {})

    const Component: FC<Props> = flowMax(
      addEffectOnUnmount(({x}) => () => {
        console.log(x)
      }),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'add-effect-on-unmount'
    const {rerender, unmount} = render(<Component x={3} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
    rerender(<Component x={5} testId={testId} />)
    expect(console.log).toHaveBeenCalledTimes(0)
    expect(screen.getByTestId(testId)).toHaveTextContent('5')
    unmount()
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledWith(5)
  })
})
