# ad-hok-utils

Ad-hok-utils is a collection of useful [ad-hok](https://github.com/helixbass/ad-hok) helpers
(you can think of them as roughly comparable to a collection of custom React hooks)

## Table of contents

- [Installation](#installation)
- [Usage with Typescript](#usage-with-typescript)
- [Helpers](#helpers)
  * [addContextProvider()](#addcontextprovider)
  * [getContextHelpers()/getContextHelpersFromInitialValues()](#getcontexthelpers-getcontexthelpersfrominitialvalues)
  * [addEffectOnMount()](#addeffectonmount)
  * [addLayoutEffectOnMount()](#addlayouteffectonmount)
  * [addEffectOnUnmount()](#addeffectonunmount)
  * [addIsInitialRender()](#addisinitialrender)



## Installation

Ad-hok-utils expects to be used with at least version 0.1.1 of ad-hok

So install a compatible version of ad-hok (if not already installed) along with ad-hok-utils:
```
$ npm install --save ad-hok ad-hok-utils

# or if you use yarn:

$ yarn add ad-hok ad-hok-utils
```

## Usage with Typescript

Ad-hok-utils ships with its own Typescript typings so by following the installation step above
you should be ready to use it on a Typescript + React project

## Helpers


### `addContextProvider()`
```js
addContextProvider(
  context: ReactContextObject,
  contextValuePropName: string
): Function
```

Accepts a React context object and an existing prop name which is expected to contain the value to
provide for that context

```typescript
const NameContext = React.createContext<{name: string}>({name: ''})

const MyComponent: FC<{name: string}> = flowMax(
  addProps(({name}) => ({
    contextValue: {name},
  }), ['name']),
  addContextProvider(NameContext, 'contextValue'),
  ({children}) => <>{children}</>
)
```

See [`getContextHelpers()`](#getcontexthelpers-getcontexthelpersfrominitialvalues) for a higher-level set of context helpers


### `getContextHelpers()`/`getContextHelpersFromInitialValues()`
```js
getContextHelpers(
  propNamesObject: Object
) => [ContextProviderHelper, ContextConsumerHelper] | {provider: ContextProviderHelper, consumer: ContextConsumerHelper, Context: ReactContextObject}

getContextHelpersFromInitialValues(
  initialValues: Object
) => [ContextProviderHelper, ContextConsumerHelper] | {provider: ContextProviderHelper, consumer: ContextConsumerHelper, Context: ReactContextObject}
```

Encapsulates the creation of a React context and generation of context provider and consumer helpers. Expects the context value to be
an object (rather than eg a simple primitive value)

The "contract" is that the generated context provider expects there to be existing props with names corresponding to the keys of the context object
(and it will assemble a stable provided context value from the current values of those props).
And the generated context consumer will "spread" those context value keys into top-level props

If you don't want to bother with supplying a (correctly typed, in the case of Typescript) set of initial values because the context
should only be consumed inside of a mounted context provider, then use `getContextHelpers()`:
```typescript
import {getContextHelpers, toObjectKeys} from 'ad-hok-utils'

const [addNameContextProvider, addNameContext] = getContextHelpers<{name: string}>(toObjectKeys(['name']))

const MyParentComponent: FC = flowMax(
  addProps({
    name: 'Jill',
  }),
  addNameContextProvider,
  () =>
    <MyChildComponent />
)

const MyChildComponent: FC = flowMax(
  addNameContext,
  ({name}) => <div>Hello {name}</div>
)
```
Note the use of the `toObjectKeys()` helper to provide the list of keys/incoming prop names as a "skeleton object" (which makes the
Typescript typing stronger than passing an actual array of keys would). You certainly don't have to use `toObjectKeys()` and could
instead manually provide a "skeleton" object literal with the expected keys (eg `{name: undefined}`), but it's discouraged because
that tends to look like initial context values when it fact it isn't

If you do render a generated context consumer without a corresponding mounted provider, it will immediately throw a helpful error message

Notice how the actual React context object itself is fully encapsulated by `getContextHelpers()` - typically you won't need access to it,
but if you do you can use the alternative object-style destructuring of the return value of `getContextHelpers()`:
```typescript
const {
  provider: addNameContextProvider,
  consumer: addNameContext,
  Context: NameContext
} = getContextHelpers<{name: string}>(toObjectKeys(['name']))
```



### `addEffectOnMount()`
```js
addEffectOnMount(
  callback: (props: Object) => Function
): Function
```

Accepts an effect callback to be run only once on component mount.
Thin convenience wrapper around [`addEffect()`](https://github.com/helixbass/ad-hok#addeffect)

```typescript
const MyComponent: FC<{name: string}> = flowMax(
  addEffectOnMount(({name}) => () => {
    console.log(`Initial name: ${name}`)
  }),
  ({name}) => <div>{name}</div>
)
```


### `addLayoutEffectOnMount()`
```js
addLayoutEffectOnMount(
  callback: (props: Object) => Function
): Function
```

Accepts an effect callback to be run only once as a [layout effect](https://reactjs.org/docs/hooks-reference.html#uselayouteffect) on component mount.
Thin convenience wrapper around [`addLayoutEffect()`](https://github.com/helixbass/ad-hok#addlayouteffect)

```typescript
const MyComponent: FC<{name: string}> = flowMax(
  addLayoutEffectOnMount(({name}) => () => {
    console.log(`Initial name: ${name}`)
  }),
  ({name}) => <div>{name}</div>
)
```


### `addEffectOnUnmount()`
```js
addEffectOnUnmount(
  callback: (props: Object) => Function
): Function
```

Accepts an effect callback to be run only once on component unmount.
Thin convenience wrapper around [`addEffect()`](https://github.com/helixbass/ad-hok#addeffect)

```typescript
const MyComponent: FC<{name: string}> = flowMax(
  addEffectOnUnmount(({name}) => () => {
    console.log(`Final name: ${name}`)
  }),
  ({name}) => <div>{name}</div>
)
```


### `addIsInitialRender()`
```js
addIsInitialRender: Function
```

Exposes an `isInitialRender` boolean prop that will only be true during the first render of a component

```typescript
const MyComponent: FC = flowMax(
  addIsInitialRender,
  ({isInitialRender}) => <div>{isInitialRender ? 'first' : 'subsequent'}</div>
)
```






