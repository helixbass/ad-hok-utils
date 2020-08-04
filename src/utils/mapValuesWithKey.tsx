import {mapValues} from 'lodash/fp'

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

const mapValuesWithKey: MapValuesWithKeyType = (mapValues as any).convert({
  cap: false,
})

export default mapValuesWithKey
