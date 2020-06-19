import {branch, renderNothing} from 'ad-hok'
import {some} from 'lodash/fp'

import {ensureArray} from './utils'

type SuppressUnlessPropType = <
  // eslint-disable-next-line @typescript-eslint/ban-types
  TProps extends {},
  TPropNames extends keyof TProps
>(
  propNames: Array<TPropNames> | TPropNames,
) => (
  props: TProps,
) => TProps &
  Required<{[PropName in TPropNames]: NonNullable<TProps[PropName]>}>

const suppressUnlessProp: SuppressUnlessPropType = (propName) => {
  const propNames = ensureArray(propName)
  return branch(
    (props: {[propName: string]: any}) =>
      some((propName: string) => props[propName] == null)(propNames),
    renderNothing(),
  ) as any
}

export default suppressUnlessProp
