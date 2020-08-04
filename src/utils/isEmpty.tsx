// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_isempty
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const isEmpty = (obj: any) =>
  [Object, Array].indexOf((obj || {}).constructor) >= 0 &&
  !Object.keys(obj || {}).length

export default isEmpty
