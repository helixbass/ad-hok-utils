type DeclarePropTypesLooseningType = <TPropTypes>() => <
  TProps extends TPropTypes
>(
  props: TProps,
) => Omit<TProps, keyof TPropTypes> & TPropTypes

const declarePropTypesLoosening: DeclarePropTypesLooseningType = () => (
  props,
) => props

export default declarePropTypesLoosening
