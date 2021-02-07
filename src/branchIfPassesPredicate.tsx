import {ReactElement} from 'react'
import {branch, returns, renderNothing} from 'ad-hok'

// https://stackoverflow.com/a/62097481/732366
type ExtractPredicateType<TTypePredicate> = TTypePredicate extends (
  value: any,
) => value is infer TPredicateType
  ? TPredicateType
  : never

type BranchIfPassesPredicate = <
  TProps extends {},
  TPropName extends keyof TProps,
  TTypePredicate extends (value: TProps[TPropName]) => boolean
>(
  propName: TPropName,
  typePredicate: TTypePredicate,
  opts?: {
    returns?: (
      props: TProps &
        {
          [propName in TPropName]: ExtractPredicateType<TTypePredicate>
        },
    ) => ReactElement<any, any> | null
  },
) => (
  props: TProps,
) => TProps &
  {
    [propName in TPropName]: Exclude<
      TProps[TPropName],
      ExtractPredicateType<TTypePredicate>
    >
  }

const branchIfPassesPredicate: BranchIfPassesPredicate = (
  propName,
  typePredicate,
  opts,
) =>
  branch(
    ({[propName]: propValue}) => typePredicate(propValue as any),
    opts?.returns ? returns(opts.returns) : renderNothing(),
  ) as any

export default branchIfPassesPredicate
