import ensureArray from './utils/ensureArray'
import omit from './utils/omit'

type RemovePropsType = <TProps extends {}, TPropNames extends keyof TProps>(
  propNames: TPropNames[] | TPropNames,
) => (props: TProps) => Omit<TProps, TPropNames>

const removeProps: RemovePropsType = (propNames) => (props) =>
  omit(ensureArray(propNames), props) as any

export default removeProps
