import { createContext, useReducer, type FC, type ReactNode } from 'react';
import {
  userReducer,
  initialState,
  type Action,
} from '../../reducers/user/index';
import { type USER_TYPE } from '../../type';
export const contextValue: {
  state: USER_TYPE;
  dispatch: React.Dispatch<Action>;
} = {
  state: initialState,
  dispatch: () => null,
};

export const UserContext = createContext(contextValue);

interface Props {
  children: ReactNode;
}

const UserContextProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
