import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax} from 'ad-hok'

import {addPropIdentityStabilization} from '..'

describe('addPropIdentityStabilization()', () => {
  test('stabilizes prop identity', () => {
    interface EmptyPureProps {
      x: {
        y: number
      }
      testId: string
    }

    const EmptyPure: FC<EmptyPureProps> = React.memo(({x, testId}) => {
      console.log('EmptyPure re-rendered')
      return <div data-testid={testId}>{x.y}</div>
    })

    interface Props {
      x: {
        y: number
      }
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addPropIdentityStabilization('x'),
      ({x}) => <EmptyPure x={x} testId={testId} />,
    )

    const x3 = {y: 3}
    const x3Equal = {y: 3}
    const x4 = {y: 4}
    const x4Equal = {y: 4}

    jest.spyOn(console, 'log').mockImplementation(() => {})

    const testId = 'prop-identity-stabilization'
    const {rerender} = render(<Component x={x3} testId={testId} />)
    expect(console.log).toHaveBeenCalledTimes(1)
    ;(console.log as any).mockClear()
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
    rerender(<Component x={x3} testId={testId} />)
    expect(console.log).not.toHaveBeenCalled()
    rerender(<Component x={x3Equal} testId={testId} />)
    expect(console.log).not.toHaveBeenCalled()
    rerender(<Component x={x4} testId={testId} />)
    expect(console.log).toHaveBeenCalledTimes(1)
    ;(console.log as any).mockClear()
    rerender(<Component x={x4Equal} testId={testId} />)
    expect(console.log).not.toHaveBeenCalled()
  })
})
