import { createContext, useReducer, type FC, type ReactNode } from 'react';
import {
  loadingReducer,
  initialState,
  type State,
  type Action,
} from '../../reducers/loading/index';

export const contextValue: {
  state: State;
  dispatch: React.Dispatch<Action>;
} = {
  state: initialState,
  dispatch: () => null,
};

export const LoadingContext = createContext(contextValue);

interface Props {
  children: ReactNode;
}

const LoadingContextProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(loadingReducer, initialState);

  return (
    <LoadingContext.Provider value={{ state, dispatch }}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContextProvider;
