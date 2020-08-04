type DeclarePropTypesForcingType = <TPropTypes>() => <
  TProps extends {
    [propName in keyof TPropTypes]: any
  }
>(
  props: TProps,
) => Omit<TProps, keyof TPropTypes> & TPropTypes

const declarePropTypesForcing: DeclarePropTypesForcingType = () => (props) =>
  props as any

export default declarePropTypesForcing
