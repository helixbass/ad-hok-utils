import {isArray} from 'lodash'
import {mapValues} from 'lodash/fp'

type EnsureArrayType = <TMaybeArray>(
  maybeArray: TMaybeArray,
) => TMaybeArray extends Array<any> ? TMaybeArray : Array<TMaybeArray>

export const ensureArray: EnsureArrayType = (maybeArray) =>
  (isArray(maybeArray) ? maybeArray : [maybeArray]) as any

type ObjectMapperType<TObject> = (
  values: TObject[keyof TObject],
  key: keyof TObject,
) => any

type MapValuesWithKeyType = <
  TMapper extends ObjectMapperType<TObject>,
  TObject
>(
  mapper: TMapper,
  object: TObject,
) => {[key in keyof TObject]: ReturnType<TMapper>}

export const mapValuesWithKey: MapValuesWithKeyType = (mapValues as any).convert(
  {
    cap: false,
  },
)

export const tuple = <T extends any[]>(...args: T): T => args
