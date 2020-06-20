import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addProps} from 'ad-hok'

import {addComponentBoundary} from '..'

describe('addComponentBoundary()', () => {
  test('creates nested component boundary', () => {
    interface Props {
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addProps({
        x: 3,
      }),
      addComponentBoundary,
      ({x}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'component-boundary'
    render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
    expect((Component as any)().type.displayName).toEqual('addWrapper()')
  })
})
