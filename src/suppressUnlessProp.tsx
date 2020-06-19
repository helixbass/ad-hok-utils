import {branch, renderNothing} from 'ad-hok'
import {some} from 'lodash/fp'

import {ensureArray} from 'utils/fp'

type SuppressUnlessPropType = <
  TProps extends {},
  TPropNames extends keyof TProps
>(
  propNames: Array<TPropNames> | TPropNames
) => (
  props: TProps
) => TProps & {[PropName in TPropNames]: NonNullable<TProps[PropName]>}

const suppressUnlessProp: SuppressUnlessPropType = (propName) => {
  const propNames = ensureArray(propName)
  return branch(
    (props: {[propName: string]: any}) =>
      some((propName: string) => props[propName] == null)(propNames),
    renderNothing()
  ) as any
}

export default suppressUnlessProp
