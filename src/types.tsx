export type PlainObject = {
  [prop: string]: any
}

export type Action<T> = {
  type: string
  payload?: T
}

export type Store<T> = {
  useStore: () => {
    state: T
    setState: (newState: T) => void
    resetState: () => void
  }
  getState: () => T
  dispatch: (action: Action<T>) => void
  subscribe: (dispatchEvent: any) => () => void
}
