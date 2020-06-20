import {SimpleUnchangedProps, addWrapper} from 'ad-hok'

const addComponentBoundary: SimpleUnchangedProps = addWrapper((render) =>
  render(),
)

export default addComponentBoundary
