import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {flowMax, addProps} from 'ad-hok'

import {
  getContextHelpers,
  getContextHelpersFromInitialValues,
  toObjectKeys,
} from '..'

describe('getContextHelpers()', () => {
  test('returns context helpers as tuple', () => {
    const [addFooContextProvider, addFooContext] = getContextHelpers<{
      x: number
      y: string
    }>(toObjectKeys(['x', 'y']))

    interface ConsumerProps {
      testId: string
    }

    const Consumer: FC<ConsumerProps> = flowMax(
      addFooContext,
      ({x, y, testId}) => (
        <div data-testid={testId}>
          {x}
          {y}
        </div>
      ),
    )

    interface Props {
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addProps({
        x: 3,
        y: 'abc',
      }),
      addFooContextProvider,
      ({testId}) => <Consumer testId={testId} />,
    )

    const testId = 'get-context-helpers-tuple'
    render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('3abc')
  })

  test('returns context helpers as object', () => {
    const {
      addProvider: addFooContextProvider,
      addConsumer: addFooContext,
    } = getContextHelpers<{
      x: number
    }>(toObjectKeys(['x']))

    interface ConsumerProps {
      testId: string
    }

    const Consumer: FC<ConsumerProps> = flowMax(
      addFooContext,
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    interface Props {
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addProps({
        x: 4,
      }),
      addFooContextProvider,
      ({testId}) => <Consumer testId={testId} />,
    )

    const testId = 'get-context-helpers-object'
    render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('4')
  })

  test("throws helpful error message if you haven't rendered a provider", () => {
    const {addConsumer: addFooContext} = getContextHelpers<{
      x: number
      y: string
    }>(toObjectKeys(['x', 'y']))

    const Consumer: FC = flowMax(addFooContext, () => <div />)

    jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Consumer />)).toThrow(
      /Missing context value that supplies "x", "y", did you forget to render a provider\?/,
    )
    ;(console.error as any).mockRestore()
  })
})

describe('getContextHelpersFromInitialValues()', () => {
  test('returns context helpers as tuple', () => {
    const [
      addFooContextProvider,
      addFooContext,
    ] = getContextHelpersFromInitialValues({
      x: 6,
      y: 'abc',
    })

    interface ConsumerProps {
      testId: string
    }

    const Consumer: FC<ConsumerProps> = flowMax(
      addFooContext,
      ({x, y, testId}) => (
        <div data-testid={testId}>
          {x}
          {y}
        </div>
      ),
    )

    interface Props {
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addProps({
        x: 7,
        y: 'abc',
      }),
      addFooContextProvider,
      ({testId}) => <Consumer testId={testId} />,
    )

    const testId = 'get-context-helpers-from-initial-values-tuple'
    render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('7abc')
  })

  test('returns context helpers as object', () => {
    const {
      addProvider: addFooContextProvider,
      addConsumer: addFooContext,
    } = getContextHelpersFromInitialValues({
      x: 8,
    })

    interface ConsumerProps {
      testId: string
    }

    const Consumer: FC<ConsumerProps> = flowMax(
      addFooContext,
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    interface Props {
      testId: string
    }

    const Component: FC<Props> = flowMax(
      addProps({
        x: 9,
      }),
      addFooContextProvider,
      ({testId}) => <Consumer testId={testId} />,
    )

    const testId = 'get-context-helpers-from-initial-values-object'
    render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('9')
  })
})
