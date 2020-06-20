import React, {FC} from 'react'
import {UnchangedProps, addWrapperHOC, PropAddingHOCType} from 'ad-hok'

const getNamedPassthroughHOC = (name: string) => {
  const PassthroughComponent: FC = ({children}) => <>{children}</>
  PassthroughComponent.displayName = name
  return (Component: any) => (props: any) => (
    <PassthroughComponent>
      <Component {...props} />
    </PassthroughComponent>
  )
}

type AddNamedComponentBoundaryType = <TProps>(
  name: string,
) => UnchangedProps<TProps>

const addNamedComponentBoundary: AddNamedComponentBoundaryType = (
  name: string,
) => addWrapperHOC(getNamedPassthroughHOC(name) as PropAddingHOCType<{}>)

export default addNamedComponentBoundary
