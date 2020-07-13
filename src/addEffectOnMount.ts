import {CurriedUnchangedProps, addEffect} from 'ad-hok'

type AddEffectOnMountType = <TProps>(
  callback: (props: TProps) => () => void,
) => CurriedUnchangedProps<TProps>

const addEffectOnMount: AddEffectOnMountType = (callback) =>
  addEffect(callback, [])

export default addEffectOnMount
