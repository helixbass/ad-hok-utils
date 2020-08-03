type DeclarePropTypesNarrowingType = <TPropTypes>() => <
  TProps extends {
    [key in keyof TPropTypes]: any
  }
>(
  props: TProps,
) => TProps & TPropTypes

const declarePropTypesNarrowing: DeclarePropTypesNarrowingType = () => (
  props,
) => props as any

export default declarePropTypesNarrowing
