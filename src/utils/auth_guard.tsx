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
import { type PROFILE_TYPE } from '../type/index';
import { LoadingContext } from '../contexts/loading';

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
  const loading = useContext(LoadingContext);
  const profColRef = collection(
    db,
    'profiles'
  ) as CollectionReference<PROFILE_TYPE>;

  useEffect(() => {
    try {
      loading.dispatch({
        type: 'SHOW_LOADING',
        payload: {
          message: '認証中...',
        },
      });
      const auth = getAuth();
      return onAuthStateChanged(auth, (currentUer) => {
        if (currentUer) {
          if (!userContext.state.id) {
            setState({
              user: currentUer,
            });
            userContext.dispatch({
              type: 'SET_USER_ID',
              payload: {
                id: currentUer.uid,
              },
            });
            if (!userContext.state.name) {
              getDoc(doc(profColRef, currentUer.uid))
                .then((snapshot) => {
                  if (!snapshot.data()?.name) {
                    navigate('/profile/create');
                  }
                  if (snapshot.exists()) {
                    userContext.dispatch({
                      type: 'SET_PROFILE',
                      payload: snapshot.data(),
                    });
                  }
                  loading.dispatch({
                    type: 'HIDE_LOADING',
                  });
                })
                .catch(() => {
                  throw new Error();
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
      loading.dispatch({
        type: 'HIDE_LOADING',
      });
    }
  }, []);

  if (state.user === null) {
    navigate('/auth/sign_in');
    return null;
  }

  return <>{props.children}</>;
};
