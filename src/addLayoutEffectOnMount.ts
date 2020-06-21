import {addLayoutEffect, UnchangedProps} from 'ad-hok'

type AddLayoutEffectOnMountType = <TProps>(
  callback: (props: TProps) => () => void,
) => UnchangedProps<TProps>

const addLayoutEffectOnMount: AddLayoutEffectOnMountType = (callback) =>
  addLayoutEffect(callback, [])

export default addLayoutEffectOnMount
