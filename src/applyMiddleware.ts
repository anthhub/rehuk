import compose from './compose'

export default function applyMiddleware(...middlewares: any[]) {
  return (createStore: any) => (reducer: any, state: any) => {
    const store = createStore(reducer, state)
    let dispatch: any = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action: any) => dispatch(action)
    }
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
