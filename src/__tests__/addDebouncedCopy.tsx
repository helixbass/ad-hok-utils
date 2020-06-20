import React, {FC} from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax} from 'ad-hok'

import {addDebouncedCopy} from '..'

describe('addDebouncedCopy()', () => {
  test('debounces setting of prop copy', async () => {
    interface Props {
      x: number
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addDebouncedCopy(500, 'x', 'xDebounced'),
      ({xDebounced}) => <div data-testid={testId}>{xDebounced}</div>,
    )

    const testId = 'add-debounced-copy'
    const {rerender} = render(<Component x={3} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
    rerender(<Component x={5} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
    await waitFor(() => screen.getByText('5'))
    expect(screen.getByTestId(testId)).toHaveTextContent('5')
  })
})
