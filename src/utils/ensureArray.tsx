import {isArray} from 'lodash'

type EnsureArrayType = <TMaybeArray>(
  maybeArray: TMaybeArray,
) => TMaybeArray extends Array<any> ? TMaybeArray : Array<TMaybeArray>

const ensureArray: EnsureArrayType = (maybeArray) =>
  (isArray(maybeArray) ? maybeArray : [maybeArray]) as any

export default ensureArray
