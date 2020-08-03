type DeclarePropTypesUnrecognized = <TPropTypes>() => <TProps>(
  props: TProps,
) => TProps & TPropTypes

const declarePropTypesUnrecognized: DeclarePropTypesUnrecognized = () => (
  props,
) => props as any

export default declarePropTypesUnrecognized
