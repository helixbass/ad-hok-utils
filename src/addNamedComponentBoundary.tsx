import React, {FC} from 'react'
import {CurriedUnchangedProps, addWrapperHOC, PropAddingHOC} from 'ad-hok'

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
) => CurriedUnchangedProps<TProps>

const addNamedComponentBoundary: AddNamedComponentBoundaryType = (
  name: string,
) => addWrapperHOC(getNamedPassthroughHOC(name) as PropAddingHOC<{}>)

export default addNamedComponentBoundary
