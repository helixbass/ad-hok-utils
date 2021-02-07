# ad-hok-utils

Ad-hok-utils is a collection of useful [ad-hok](https://github.com/helixbass/ad-hok) helpers
(you can think of them as roughly comparable to a collection of custom React hooks)

## Table of contents

- [Installation](#installation)
- [Usage with Typescript](#usage-with-typescript)
- [Helpers](#helpers)
  * [addInterval()](#addinterval)
  * [addPropTrackingRef()](#addproptrackingref)
  * [addPropIdentityStabilization()](#addpropidentitystabilization)
  * [addDebouncedHandler()](#adddebouncedhandler)
  * [addDebouncedCopy()](#adddebouncedcopy)
  * [addContextProvider()](#addcontextprovider)
  * [getContextHelpers()/getContextHelpersFromInitialValues()](#getcontexthelpersgetcontexthelpersfrominitialvalues)
  * [branchIfNullish()](#branchifnullish)
  * [branchIfFalsy()](#branchiffalsy)
  * [branchIfEmpty()](#branchifempty)
  * [branchIfFailsPredicate()](#branchiffailspredicate)
  * [addExtendedHandlers()](#addextendedhandlers)
  * [addEffectOnMount()](#addeffectonmount)
  * [addLayoutEffectOnMount()](#addlayouteffectonmount)
  * [addEffectOnUnmount()](#addeffectonunmount)
  * [addIsInitialRender()](#addisinitialrender)
  * [addReducerOverProps()](#addreduceroverprops)
  * [removeProps()](#removeprops)
  * [addNamedComponentBoundary()](#addnamedcomponentboundary)
  * [addComponentBoundary()](#addcomponentboundary)
- [Typescript-specific helpers](#typescript-specific-helpers)
  * [cleanupProps()](#cleanupprops)
  * [declarePropTypesNarrowing()](#declareproptypesnarrowing)
  * [declarePropTypesForcing()](#declareproptypesforcing)
  * [declarePropTypesUnrecognized()](#declareproptypesunrecognized)
  * [declarePropsNonNullish()](#declarepropsnonnullish)
- [Help / Contributions / Feedback](#help--contributions--feedback)
- [License](#license)





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



### `addInterval()`
```js
addInterval(
  callback: (props: Object) => Function,
  delay: number | null | ((props: Object) => number | null),
  additionalDependenciesThatShouldTriggerResettingInterval?: string[]
): Function
```

Per [this article](https://overreacted.io/making-setinterval-declarative-with-react-hooks/) (whose `useInterval()` hook it uses under the hood), sets up an interval timer with a dynamically adjustable delay (can pause by setting delay to `null`).
If there are additional props (other than the delay) that should trigger resetting the interval when they change, you can pass a [dependencies argument](https://github.com/helixbass/ad-hok#dependencies-arguments)-style list of prop names as the third argument

```typescript
const MyComponent: FC<{name: string}> = flowMax(
  addInterval(({name}) => () => {
    console.log(`Hello again, {name}!`)
  }, 4000, ['name']),
  ({name}) => <div>{name}</div>
)
```


### `addPropTrackingRef()`
```js
addPropTrackingRef(
  propName: string,
  refPropName: string
): Function
```

Sometimes it's useful to have a ref that always tracks the latest value of some prop. `addPropTrackingRef()` takes the name of the
existing prop to track and the name of a [mutable ref](https://reactjs.org/docs/refs-and-the-dom.html#creating-refs) prop to add:

```typescript
const MyComponent: FC<{name: string}> = flowMax(
  addPropTrackingRef('name', 'nameRef'),
  addEffect(({nameRef}) => () => {
    setTimeout(() => {
      console.log("current name", nameRef.current)
    }, 2000)
  },
  ({name}) => <div>{name}</div>
)
```



### `addPropIdentityStabilization()`
```js
addPropIdentityStabilization(
  propName: string
): Function
```

Typically when a prop's value is effectively unchanged you want its identity to stay stable (so that eg other things using it as a
dependency don't retrigger). But when the prop's value is coming from somewhere you don't control and may be changing identity even
if it's still the same value according to an [`isEqual()`](https://lodash.com/docs/4.17.15#isEqual)-style comparison, you can use
`addPropIdentityStabilization()` to keep its identity stable unless its value has actually changed:

```typescript
const MyComponent: FC<{someData: SomeData}> = flowMax(
  addPropIdentityStabilization('someData'),
  addProps(({someData}) => ({
    foo: someExpensiveComputation(someData),
  }), ['someData']),
  ({foo}) => <div>{foo}</div>
)
```



### `addDebouncedHandler()`
```js
addDebouncedHandler(
  waitInterval: number,
  handlerPropName: string
): Function
```

Accepts a debouncing wait interval (in milliseconds) and an existing handler prop name and "replaces" that handler prop with a
debounced version of the handler:

```typescript
const MyComponent: FC<{onChange: (value: string) => void}> = flowMax(
  addDebouncedHandler(300, 'onChange'),
  ({onChange}) => <Search onChange={onChange} />
)
```



### `addDebouncedCopy()`
```js
addDebouncedCopy(
  waitInterval: number,
  propName: string,
  debouncedPropName: string
): Function
```

In the hooks/ad-hok world of triggering things based on dependencies changing, it's a helpful concept (more helpful than debouncing
handlers in my opinion) to debounce prop values. `addDebouncedCopy()` takes a debouncing wait interval and an existing
prop name and exposes a debounced version of that prop value under another specified prop name:

```typescript
const MyComponent: FC<{foo: string}> = flowMax(
  addDebouncedCopy(300, 'foo', 'fooDebounced'),
  addEffect(({fooDebounced}) => () => {
    console.log('foo debounced', fooDebounced)
  }, ['fooDebounced']),
  ({foo}) => <div>the "live" value of foo is: {foo}</div>
)
```


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


### `branchIfNullish()`
```js
branchIfNullish(
  propNames: string | string[]
  opts?: {
    returns?: (props: Object) => ReactElement
  }
): Function
```

Encapsulates the common pattern of "aborting" the chain (ie `branch()`'ing to `renderNothing()` or to `returns()` some JSX elements)
if any of the given props is nullish (ie `null` or `undefined`). By default it renders `null`, or you can supply a `returns` option
to specify what to render

For Typescript, it'll automatically narrow the types of the given props to be non-nullish after this step in the chain

```typescript
import {branchIfNullish} from 'ad-hok-utils'

const MyComponent: FC<{name?: string | null}> = flowMax(
  branchIfNullish('name'),
  addProps(({name}) => ({
    nameUppercase: name.toUpperCase(),
  })),
  ({nameUppercase}) => <div>{nameUppercase}</div>
)

<MyComponent /> // renders null

<MyComponent name={null} /> // renders null

<MyComponent name="Bert" /> // renders "BERT"

// or, specify what to render when aborting:

const MyComponent: FC<{name?: string | null, testId: string}> = flowMax(
  branchIfNullish('name', {returns: ({testId}) => <div data-testid={testId}>aborted</div>}),
  addProps(({name}) => ({
    nameUppercase: name.toUpperCase(),
  })),
  ({nameUppercase, testId}) => <div data-testid={testId}>{nameUppercase}</div>
)

<MyComponent /> // renders "aborted"

<MyComponent name={null} /> // renders "aborted"

<MyComponent name="Bert" /> // renders "BERT"
```



### `branchIfFalsy()`
```js
branchIfFalsy(
  propNames: string | string[]
  opts?: {
    returns?: (props: Object) => ReactElement
  }
): Function
```

Aborts the chain if any of the given props is "falsy" (eg `null`, `undefined`, `false`, `""`, `0`).
By default it renders `null`, or you can supply a `returns` option to specify what to render

For Typescript, it'll automatically narrow the types of the given props to be non-nullish (and to exclude `false` if it's a boolean prop)
after this step in the chain

```typescript
import {branchIfFalsy} from 'ad-hok-utils'

const MyComponent: FC<{name?: string | null}> = flowMax(
  branchIfFalsy('name'),
  addProps(({name}) => ({
    nameUppercase: name.toUpperCase(),
  })),
  ({nameUppercase}) => <div>{nameUppercase}</div>
)

<MyComponent /> // renders null

<MyComponent name={null} /> // renders null

<MyComponent name="" /> // renders null

<MyComponent name="Bert" /> // renders "BERT"

// or, specify what to render when aborting:

const MyComponent: FC<{name?: string | null, testId: string}> = flowMax(
  branchIfFalsy('name', {returns: ({testId}) => <div data-testid={testId}>aborted</div>}),
  addProps(({name}) => ({
    nameUppercase: name.toUpperCase(),
  })),
  ({nameUppercase, testId}) => <div data-testid={testId}>{nameUppercase}</div>
)

<MyComponent /> // renders "aborted"

<MyComponent name={null} /> // renders "aborted"

<MyComponent name="" /> // renders "aborted"

<MyComponent name="Bert" /> // renders "BERT"
```



### `branchIfEmpty()`
```js
branchIfEmpty(
  propNames: string | string[]
  opts?: {
    returns?: (props: Object) => ReactElement
  }
): Function
```

Aborts the chain if any of the given props is empty according to [`isEmpty()`](https://lodash.com/docs/4.17.15#isEmpty).
By default it renders `null`, or you can supply a `returns` option to specify what to render

For Typescript, it'll automatically narrow the types of the given props to be non-nullish after this step in the chain

```typescript
import {branchIfEmpty} from 'ad-hok-utils'

const MyComponent: FC<{names?: string[] | null}> = flowMax(
  branchIfEmpty('names'),
  addProps(({names}) => ({
    namesUppercase: names.map(name => name.toUpperCase()),
  })),
  ({namesUppercase}) => <div>{namesUppercase.join(', ')}</div>
)

<MyComponent /> // renders null

<MyComponent names={null} /> // renders null

<MyComponent names={[]} /> // renders null

<MyComponent names={["Bert", "Ernest"]} /> // renders "BERT, ERNEST"

// or, specify what to render when aborting:

const MyComponent: FC<{names?: string[] | null, testId: string}> = flowMax(
  branchIfEmpty('names', {returns: ({testId}) => <div data-testid={testId}>aborted</div>}),
  addProps(({names}) => ({
    namesUppercase: names.map(name => name.toUpperCase()),
  })),
  ({namesUppercase, testId}) => <div data-testid={testId}>{namesUppercase.join(', ')}</div>
)

<MyComponent /> // renders "aborted"

<MyComponent names={null} /> // renders "aborted"

<MyComponent names={[]} /> // renders "aborted"

<MyComponent names={["Bert", "Ernest"]} /> // renders "BERT, ERNEST"
```



### `branchIfFailsPredicate()`
```js
branchIfFailsPredicate(
  propName: string
  predicate: (value: any) => boolean
  opts?: {
    returns?: (props: Object) => ReactElement
  }
): Function
```

Aborts the chain if the given predicate function returns false when called with the given prop.
By default it renders `null`, or you can supply a `returns` option to specify what to render

For Typescript, the predicate is expected to be a [type predicate](https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates)
and it'll automatically narrow the type of the given prop to the type specified by the type predicate after this step in the chain.
It'll also automatically narrow the type of the given prop to exclude the type specified by the type predicate inside the `returns` option callback

```typescript
import {branchIfFailsPredicate} from 'ad-hok-utils'

const isNumber = (val: any): val is number =>
  Object.prototype.toString.call(val) === '[object Number]'

const MyComponent: FC<{value: string | number}> = flowMax(
  branchIfFailsPredicate('value', isNumber),
  addProps(({value}) => ({
    valueIncremented: value + 1,
  })),
  ({valueIncremented}) => <div>{valueIncremented}</div>
)

<MyComponent value="hello" /> // renders null

<MyComponent value={2} /> // renders "3"

// or, specify what to render when aborting:

const MyComponent: FC<{value: string | number, testId: string}> = flowMax(
  branchIfFailsPredicate('value', isNumber, {returns: ({value, testId}) => <div data-testid={testId}>{value.toUpperCase()}</div>}),
  addProps(({value}) => ({
    valueIncremented: value + 1,
  })),
  ({valueIncremented, testId}) => <div data-testid={testId}>{valueIncremented}</div>
)

<MyComponent value="hello" /> // renders "HELLO"

<MyComponent value={2} /> // renders "3"
```



### `addExtendedHandlers()`
```js
addExtendedHandlers(
  handlerCreators: {
    [handlerName: string]: (props: Object) => Function
  }
): Function
```

Extends existing handler props with additional behavior. When the handler is called, runs the existing handler first and then
the extending handler. Has the same signature as [`addHandlers()`](https://github.com/helixbass/ad-hok#addhandlers)

For example, you may want to perform additional actions on top of an incoming `onClick` handler when a button is clicked:
```typescript
import {addExtendedHandlers} from 'ad-hok-utils'

const MyComponent: FC<{onClick: (message: string) => void}> = flowMax(
  addExtendedHandlers({
    onClick: () => (message: string) => {
      console.log('clicked', message)
    },
  }),
  ({onClick}) => <button onClick={() => onClick('hello')}>say hello</button>
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



### `addReducerOverProps()`
```js
addReducerOverProps: (
  reducer: (props: Object) => ReducerFunction,
  initialState: Object | (props: Object) => Object
): Function
```

As mentioned in the ad-hok [`addReducer()`](https://github.com/helixbass/ad-hok#addreducer) docs, `addReducer()` only wraps a
"static reducer" (that doesn't have visibility of props). So you can use `addReducerOverProps()` to wrap a `useReducer()`-style
reducer that is dynamic with respect to props. Like `addReducer()`, it exposes the `dispatch` handler and the top-level reducer
state object properties as props:

```typescript
import {addReducerOverProps} from 'ad-hok-utils'

interface ReducerState {
  y: number
}

type ReducerAction =
  | {type: 'incrementByX'}

const MyComponent: FC<{x: number}> = flowMax(
  addReducerOverProps(
    ({x}) => (state: ReducerState, action: ReducerAction) => {
      switch (action.type) {
        case 'incrementByX':
          return {
            ...state,
            y: state.y + x
          }
        }
      }
    },
    {y: 1}
  ),
  ({y, dispatch}) =>
    <div>
      <p>{y}</p>
      <button onClick={() => dispatch({type: 'incrementByX'})}>increment by x</button>
    </div>
)
```



### `removeProps()`
```js
removeProps: (
  propNames: string | string[]
): Function
```

Takes an array of prop names or a single prop name to remove from the props object

Often it doesn't matter if there are extra props "floating around" on the props object, but one example of where it does is
when you're passing all props through to an underlying DOM element (otherwise you can get unrecognized DOM property warnings):

```typescript
import {removeProps} from 'ad-hok-utils'

const MyForm: FC<Props> = flowMax(
  addProps({
    foo: 'foo'
  }),
  addProps(({foo}) => ({
    testId: foo,
  }),
  removeProps(['foo']),
  ({testId, ...props}) => <form data-testid={testId} {...props} />
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


## Typescript-specific helpers


### `cleanupProps()`
```js
cleanupProps: (
  propNames: string | string[]
): Function
```

Takes an array of prop names or a single prop name to remove from the props object

At runtime `cleanupProps()` behaves identically to `removeProps()`, the difference is just how it's typed for Typescript.
`cleanupProps()` is meant to be used inside ad-hok helper definition chains when you want to "clean up after yourself" and
not expose props that aren't part of the advertised props interface of the helper - the issue with using `removeProps()` for
this is that then the helper's type would have to declare that it `Omit`'s the removed props, which then tends to "infect" the
types of other chains that consume that helper. `cleanupProps()`, on the other hand, pretends (from a typing perspective) that those
props are still there:

```typescript
import {cleanupProps} from 'ad-hok-utils'

type AddBar = SimplePropsAdder<{bar: number}>

const addBar: AddBar = flowMax(
  addProps({
    _foo: 3
  }),
  addProps(({_foo}) => ({
    bar: _foo + 2,
  })),
  cleanupProps(['_foo']),
)

const MyComponent: FC = flowMax(
  addBar,
  ({bar}) => <div>{bar}</div>
)
```
The use of `cleanupProps()` is dangerous - because it's "silently" removing those helper-internal props, if one of those prop names
actually also existed in an outer consuming chain, it could lead to Typescript thinking that a value is present that actually isn't:
```typescript
import {cleanupProps} from 'ad-hok-utils'

type AddBar = SimplePropsAdder<{bar: number}>

const addBarDangerous: AddBar = flowMax(
  addProps({
    foo: 3
  }),
  addProps(({foo}) => ({
    bar: foo + 2,
  })),
  cleanupProps(['foo']),
)

const MyComponent: FC = flowMax(
  addProps({
    foo: 'abc',
  }),
  addBar,
  addProps(({foo}) => ({
    fooUppercase: foo.toUpperCase() // uh-oh, this will crash at runtime
  })),
  ({fooUppercase, bar}) => <div>{fooUppercase} {bar}</div>
)
```
So notice the use of the leading underscore (`_foo`) in the first example - generally (regardless of whether you're going to "clean
up after yourself" and remove the props or not) it's good practice to try not to use prop names inside helpers that might potentially
clash with the names of preexisting props

And the only place it's recommended to use `cleanupProps()` is as the last step in a helper chain.
[`eslint-plugin-ad-hok`](https://github.com/helixbass/eslint-plugin-ad-hok) has a `cleanupprops-last` rule (enabled by its
`recommended-typescript` setting) that enforces this



### `declarePropTypesNarrowing()`
```js
declarePropTypesNarrowing: () => Function
```

When "you know better than Typescript" that a given existing prop type can be refined/narrowed, you can use `declarePropTypesNarrowing()`
to instruct Typescript about the prop types. This could come in handy eg after a `branch()`
(though prefer [`branchIfNullish()`](#branchifnullish)/[`branchIfFalsy()`](#branchiffalsy)/[`branchIfEmpty()`](#branchifempty) if they
cover your branch condition, since they do the prop type-narrowing for you):

```typescript
import {declarePropTypesNarrowing} from 'ad-hok-utils'

interface Item {
  id: string
  name?: string
}

const MyComponent: FC<{item: Item}> = flowMax(
  branch(({item: {name}}) => !name, renderNothing()),
  declarePropTypesNarrowing<{item: Item & {name: string}}>(),
  addProps(({item: {name}}) => ({
    nameUppercase: name.toUpperCase(),
  })),
  ({nameUppercase}) => <div>{nameUppercase}</div>
)
```


### `declarePropTypesForcing()`
```js
declarePropTypesForcing: () => Function
```

When "you know better than Typescript" that a given existing prop type is different than what it thinks (in a way that's not strictly
narrowing or loosening relative to what it thinks), you can use `declarePropTypesForcing()`
to instruct Typescript about the prop types. This could happen if you decide to "reuse" an existing prop name with an incompatible type
(in general that's not recommended though, as it tends to be confusing to both the reader and Typescript):

```typescript
import {declarePropTypesForcing} from 'ad-hok-utils'

const MyComponent: FC<{code: number}> = flowMax(
  addProps(({code}) => ({
    code: code === 1 ? 'abc' : code,
  })),
  // At this point Typescript thinks the type of `code` is `number` because
  // ad-hok `&`'s together its existing type (`number`) and the new type (`string | number`).
  // So we can insist on the new type:
  declarePropTypesForcing<{code: string | number}>(),
  ({code}) => <div>{isString(code) ? code.toUpperCase() : code + 2}</div>
)
```


### `declarePropTypesUnrecognized()`
```js
declarePropTypesUnrecognized: () => Function
```

When "you know better than Typescript" that certain props are present that it doesn't know about, you can use `declarePropTypesUnrecognized()`
to instruct Typescript about the prop types. This could happen if a helper adds props to the chain that it doesn't declare and you need to get
rid of them to avoid unknown DOM attribute warnings:

```typescript
import {declarePropTypesUnrecognized} from 'ad-hok-utils'
import {SimplePropsAdder} from 'ad-hok'

// doesn't declare that it also adds `prefix` to the chain
type AddName = SimplePropsAdder<{name: string}>

const addName: AddName = flowMax(
  addProps({
    prefix: 'Mr.',
  }),
  addProps(({prefix}) => ({
    name: `${prefix} Potatohead`
  })),
)

const MyComponent: FC<{className?: string}> = flowMax(
  addName,
  declarePropTypesUnrecognized<{prefix: string}>(),
  // now we can do removeProps() (otherwise Typescript would have complained):
  removeProps(['prefix']),
  ({name, ...props}) => <div {...props}>{name}</div>
)
```



### `declarePropsNonNullish()`
```js
declarePropsNonNullish: (
  propNames: string | string[]
) => Function
```

When "you know better than Typescript" that certain props are non-nullish (ie not `null` or `undefined` but otherwise the type that it thinks),
you can use `declarePropsNonNullish()` to instruct Typescript about the prop types. This could also be accomplished using
[`declarePropTypesNarrowing()`](#declareproptypesnarrowing) so is effectively a shorthand

```typescript
import {declarePropsNonNullish} from 'ad-hok-utils'

const MyComponent: FC<{name?: string | null}> = flowMax(
  branch(({name}) => name == null || name === 'Bert', renderNothing()),
  declarePropsNonNullish('name'),
  addProps(({name}) => ({
    nameUppercase: name.toUpperCase(),
  }),
  ({nameUppercase}) => <div>{nameUppercase}</div>
)
```



## Help / Contributions / Feedback

Please file an issue or submit a PR with any questions/suggestions



## License

MIT



