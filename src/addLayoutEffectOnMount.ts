import {addLayoutEffect, CurriedUnchangedProps} from 'ad-hok'

type AddLayoutEffectOnMountType = <TProps>(
  callback: (props: TProps) => () => void,
) => CurriedUnchangedProps<TProps>

const addLayoutEffectOnMount: AddLayoutEffectOnMountType = (callback) =>
  addLayoutEffect(callback, [])

export default addLayoutEffectOnMount
