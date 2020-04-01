import React, { FunctionComponent, ComponentClass } from 'react'
import { PlainObject } from './types'

// 兼容类组件
const connect = <T extends PlainObject>(stores: T) => (C: ComponentClass<any>) => {
  const WrapComponent: FunctionComponent<any> = (props: any[]) => {
    const storeProps: any = {}
    if (stores !== null && typeof stores === 'object') {
      for (let key in stores) {
        // tslint:disable-next-line: strict-type-predicates
        if (typeof stores[key] === 'function') {
          storeProps[key] = stores[key]()
        } else {
          console.error('Expected the object values to be a hooks.')
        }
      }
    } else {
      console.error(`
      Expected the inject param to like.
        { 
          store1: useStore1,
          store2: useStore2,
          ...
        }
      `)
    }
    return <C {...props} {...storeProps} />
  }
  return WrapComponent
}

export default connect
