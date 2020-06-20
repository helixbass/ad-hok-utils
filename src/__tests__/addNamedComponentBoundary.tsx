import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addProps} from 'ad-hok'

import {addNamedComponentBoundary} from '..'

describe('addNamedComponentBoundary()', () => {
  test('creates component with given display name', () => {
    interface Props {
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addProps({
        x: 3,
      }),
      addNamedComponentBoundary('Boundary'),
      ({x}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'named-component-boundary'
    render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
    expect((Component as any)().type().type.displayName).toEqual('Boundary')
  })
})
