type DeclarePropsNonNullish = <TProps, TPropNames extends keyof TProps>(
  propNames: TPropNames | TPropNames[],
) => (
  props: TProps,
) => TProps &
  Required<
    {
      [propName in TPropNames]: NonNullable<TProps[propName]>
    }
  >

const declarePropsNonNullish: DeclarePropsNonNullish = () => (props) =>
  props as any

export default declarePropsNonNullish
