import { useReducer, useEffect } from 'react'
import { Action, PlainObject, Store } from './types'

const defaultReducer = (state: PlainObject, action: Action<any>) => ({
  ...state,
  ...action.payload
})

const actionFiller = (action: any) => {
  if (action !== 'function' && !action.type && !action.payload) {
    return { type: 'default', payload: action }
  }
  return action
}

const createStore = <T extends PlainObject>(
  preloadedState: T,
  reducer: (state: T, action: Action<T>) => T = defaultReducer,
  enhancer?: any
): Store<T> => {
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }

    return enhancer((preloadedState: any, reducer: any) => createStore(reducer, preloadedState))(
      reducer,
      preloadedState
    )
  }

  const initialState = JSON.parse(JSON.stringify(preloadedState || {}))

  const liseners: Set<Function> = new Set()

  const getState = (): T => JSON.parse(JSON.stringify(model || {}))
  let model = preloadedState

  const subscribe = (dispatchEvent: any) => {
    liseners.add(dispatchEvent)
    return () => {
      liseners.delete(dispatchEvent)
    }
  }

  const dispatch = (action: Action<T>) => {
    liseners.forEach((fn: Function) => fn(action))
  }
  const setState = async (newState: T | Action<T>) => {
    dispatch(newState as Action<T>)
  }

  const resetState = () => {
    return setState(initialState)
  }

  const useStore = () => {
    const [state, dispatch] = useReducer(reducer, model)
    model = state

    useEffect(() => {
      const dispatchEvent = (action: Action<T>) => dispatch(actionFiller(action))
      return subscribe(dispatchEvent)
    }, [dispatch])
    return { state: getState(), setState, resetState }
  }

  return { useStore, getState, dispatch, subscribe }
}

export default createStore
