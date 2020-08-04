import ensureArray from './utils/ensureArray'
import omit from './utils/omit'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const cleanupProps = <TProps extends {}, TPropNames extends keyof TProps>(
  propNames: TPropNames[] | TPropNames,
) => {
  const propNamesArray = ensureArray(propNames)
  return (props: TProps): TProps => omit(propNamesArray, props) as typeof props
}

export default cleanupProps
