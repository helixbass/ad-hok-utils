import {createContext, Context} from 'react'
import {flowMax, addProps, SimplePropsAdder, addContext} from 'ad-hok'
import {pick} from 'lodash/fp'
import {zipObject} from 'lodash'

import cleanupProps from './cleanupProps'
import addContextProvider from './addContextProvider'
import tuple from './utils/tuple'

type AddProviderType<TContextValue> = <TProps extends TContextValue>(
  props: TProps,
) => TProps
type AddConsumerType<TContextValue> = SimplePropsAdder<TContextValue>

type Helpers<TContextValue> = [
  AddProviderType<TContextValue>,
  AddConsumerType<TContextValue>,
] & {
  addProvider: AddProviderType<TContextValue>
  addConsumer: AddConsumerType<TContextValue>
  Context: Context<TContextValue>
}

const makeHelpers = <TContextValue,>({
  addProvider,
  addConsumer,
  Context,
}: {
  addProvider: AddProviderType<TContextValue>
  addConsumer: AddConsumerType<TContextValue>
  Context: Context<TContextValue>
}): Helpers<TContextValue> =>
  Object.assign(tuple(addProvider, addConsumer), {
    addProvider,
    addConsumer,
    Context,
  })

export const getContextHelpersFromInitialValues = <TContextValue,>(
  initialValues: TContextValue,
  propNames = Object.keys(initialValues),
): Helpers<TContextValue> => {
  const Context = createContext<TContextValue>(initialValues)

  const valuePropName = '_getContextHelpers-value'

  const addProvider: AddProviderType<TContextValue> = flowMax(
    addProps(
      (props) => ({
        [valuePropName]: pick(propNames, props) as TContextValue,
      }),
      propNames,
    ),
    addContextProvider(Context, valuePropName),
    cleanupProps([valuePropName]),
  )

  const addConsumer: AddConsumerType<TContextValue> = flowMax(
    addContext(Context, valuePropName),
    addProps(
      ({[valuePropName]: propValue}) => {
        if (!propValue)
          throw new MissingContextValueError(
            `Missing context value that supplies ${propNames
              .map((propName) => `"${propName}"`)
              .join(', ')}, did you forget to render a provider?`,
          )
        return propValue
      },
      [valuePropName],
    ),
    cleanupProps([valuePropName]),
  )
  return makeHelpers({addProvider, addConsumer, Context})
}

const getContextHelpers = <TContextValue extends {}>(
  propNamesObject: Record<keyof TContextValue, any>,
): Helpers<TContextValue> =>
  getContextHelpersFromInitialValues(
    (undefined as unknown) as TContextValue,
    Object.keys(propNamesObject),
  )

export default getContextHelpers

class MissingContextValueError extends Error {}

export const toObjectKeys = <TKeys extends string>(
  keys: TKeys[],
): Record<TKeys, undefined> => zipObject(keys) as Record<TKeys, undefined>
