import { createContext, useReducer,type FC,type ReactNode } from 'react'
import { toastReducer, initialState,type State,type Action } from '../../reducers/toast/index'

export const contextValue: {
  state: State
  dispatch: React.Dispatch<Action>
} = {
  state: initialState,
  dispatch: () => null,
}

export const ToastContext = createContext(contextValue)

interface Props {
  children: ReactNode
}

const ToastContextProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState)

  return (
    <ToastContext.Provider value={{ state, dispatch }}>
      {children}
    </ToastContext.Provider>
  )
}

export default ToastContextProvider
