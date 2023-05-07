import { useNavigate } from 'react-router-dom';
import {
  type ReactNode,
  useEffect,
  useState,
  type FC,
  useContext,
} from 'react';
import { type User, getAuth, onAuthStateChanged } from '@firebase/auth';
import { UserContext } from '../contexts/user';
import {
  db,
  collection,
  doc,
  getDoc,
  type CollectionReference,
} from './firebase';
import { type USER_TYPE } from '../type/index';

interface Props {
  children: ReactNode;
}

export interface State {
  user: User | null | undefined;
}
const initialState: State = {
  user: undefined,
};

export const AuthGuard: FC<Props> = (props) => {
  const [state, setState] = useState<State>(initialState);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const shopsColRef = collection(db, 'profiles') as CollectionReference<USER_TYPE>;

  useEffect(() => {
    try {
      const auth = getAuth();
      return onAuthStateChanged(auth, (currentUer) => {
        if (currentUer) {
          if (!userContext.state.id){
            setState({
              user: currentUer
            });
            userContext.dispatch({
              type: 'SET_USER_ID',
              payload: {
                id: currentUer.uid,
              },
            });
            if (!userContext.state.name){
              getDoc(doc(shopsColRef, currentUer.uid))
                .then((snapshot) => {
                  console.log(snapshot.data());
                  if(!snapshot.data()?.name){
                    navigate('/profile/create')
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
            }
          }
        } else {
          setState({ user: null });
          userContext.dispatch({
            type: 'RESET',
          });
        }
      });
    } catch (error) {
      setState(initialState);
      throw error;
    }
  }, []);
  if (typeof state.user === 'undefined') {
    return <p>読み込み中...</p>;
  }

  if (state.user === null) {
    navigate('/auth/sign_in');
    return null;
  }

  return <>{props.children}</>;
};
