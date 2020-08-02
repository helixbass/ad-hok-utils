# ad-hok-utils

Ad-hok-utils is a collection of useful [ad-hok](https://github.com/helixbass/ad-hok) helpers
(you can think of them as roughly comparable to a collection of custom React hooks)

## Table of contents

- [Installation](#installation)
- [Usage with Typescript](#usage-with-typescript)
- [Helpers](#helpers)
  * [addContextProvider()](#addcontextprovider)
  * [getContextHelpers()/getContextHelpersFromInitialValues()](#getcontexthelpersgetcontexthelpersfrominitialvalues)
  * [addEffectOnMount()](#addeffectonmount)
  * [addLayoutEffectOnMount()](#addlayouteffectonmount)
  * [addEffectOnUnmount()](#addeffectonunmount)
  * [addIsInitialRender()](#addisinitialrender)
  * [addNamedComponentBoundary()](#addnamedcomponentboundary)
  * [addComponentBoundary()](#addcomponentboundary)




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
provide for that context. Renders a context provider "under the hood"

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

See [`getContextHelpers()`](#getcontexthelpersgetcontexthelpersfrominitialvalues) for a higher-level set of context helpers


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
should only ever be consumed inside of a mounted context provider, then use `getContextHelpers()`:
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
Note the use of the `toObjectKeys()` helper to provide the list of keys/incoming prop names as a "skeleton object" (which improves the
Typescript typing compared to passing an actual array of keys). You certainly don't have to use `toObjectKeys()` and could
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

#### `getContextHelpersFromInitialValues()`

If you do want to provide consumable initial values for your generated context, instead use `getContextHelpersFromInitialValues()`:
```typescript
import {getContextHelpersFromInitialValues} from 'ad-hok-utils'

const [addNameContextProvider, addNameContext] = getContextHelpersFromInitialValues({name: ''})

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



### `addEffectOnMount()`
```js
addEffectOnMount(
  callback: (props: Object) => Function
): Function
```

Accepts an effect callback to be run only once on component mount.
Thin convenience wrapper around [`addEffect()`](https://github.com/helixbass/ad-hok#addeffect)

```typescript
import {addEffectOnMount} from 'ad-hok-utils'

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
import {addLayoutEffectOnMount} from 'ad-hok-utils'

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
import {addEffectOnUnmount} from 'ad-hok-utils'

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
import {addIsInitialRender} from 'ad-hok-utils'

const MyComponent: FC = flowMax(
  addIsInitialRender,
  ({isInitialRender}) => <div>{isInitialRender ? 'first' : 'subsequent'}</div>
)
```


### `addNamedComponentBoundary()`
```js
addNamedComponentBoundary(
  displayName: string
): Function
```

Accepts a display name string and creates an internal component boundary with that display name (ad-hok can create and mount
additional components "under the hood" of your single `flowMax()` component, this is part of the "magic" of how eg `addWrapper()`
or `branch()` works)

Useful when doing fine-grained performance tuning in the React profiler. For example, if you see in the flamechart that a certain
component is taking a long time to render, you can temporarily add a bunch of `addNamedComponentBoundary()`'s to get a "line-by-line" breakdown
in the flamechart of what's slow:

```typescript
import {addNamedComponentBoundary} from 'ad-hok-utils'

const MySlowComponent: FC<Props> = flowMax(
  addProps((props) => ({
    foo: doSomethingMaybeExpensive(props),
  }),
  addNamedComponentBoundary('post-foo'),
  addProps(({foo}) => ({
    bar: doSomethingElseMaybeExpensive(foo),
  }),
  addNamedComponentBoundary('post-bar'),
  ({bar}) => <div>{bar}</div>
)
```



### `addComponentBoundary()`
```js
addComponentBoundary: Function
```

Creates an "anonymous" internal component boundary (see description of [`addNamedComponentBoundary()`](#addnamedcomponentboundary) above)

Like `addNamedComponentBoundary()`, can be useful when doing performance tuning. For example, if your component "wakes up" at a certain
point due to a context value changing, you may want to impose a component boundary right before that point in the chain to avoid re-running
the potentially expensive earlier steps in the chain:

```typescript
import {addComponentBoundary} from 'ad-hok-utils'

const MySlowComponent: FC<Props> = flowMax(
  addProps((props) => ({
    foo: doSomethingMaybeExpensive(props),
  }),
  addComponentBoundary,
  addContext(SomeContext, 'contextValue'),
  ({contextValue: {foo}}) => <div>{foo}</div>
)
```






