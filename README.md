# ad-hok-utils

Ad-hok-utils is a collection of useful [ad-hok](https://github.com/helixbass/ad-hok) helpers
(you can think of them as roughly comparable to a collection of custom React hooks)

## Table of contents

- [Installation](#installation)
- [Usage with Typescript](#usage-with-typescript)
- [Helpers](#helpers)
  * [addEffectOnMount()](#addeffectonmount)
  * [addLayoutEffectOnMount()](#addlayouteffectonmount)
  * [addEffectOnUnmount()](#addeffectonunmount)


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






