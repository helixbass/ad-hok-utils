import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, SimplePropsAdder, addProps} from 'ad-hok'

import {cleanupProps} from '..'

describe('cleanupProps()', () => {
  test('removes given props without telling Typescript', () => {
    type AddXType = SimplePropsAdder<{x: number}>
    const addX: AddXType = flowMax(
      addProps({
        x: 3,
        y: 4,
        z: 5,
      }),
      cleanupProps(['y']),
      cleanupProps('z'),
    )

    interface Props {
      testId: string
    }

    const Component: FC<Props> = flowMax(addX, ({x, ...props}) => (
      <div>
        <div data-testid={testId}>{x}</div>
        <div data-testid={`${testId}-y`}>{(props as any).y}</div>
        <div data-testid={`${testId}-z`}>{(props as any).z}</div>
      </div>
    ))

    const testId = 'cleanup-props'
    render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
    expect(screen.getByTestId(`${testId}-y`)).toBeEmptyDOMElement()
    expect(screen.getByTestId(`${testId}-z`)).toBeEmptyDOMElement()
  })
})
