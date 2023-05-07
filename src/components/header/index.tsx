import { type FC } from 'react';
import { UserContext } from '../../contexts/user';
import { useContext } from 'react';
import { auth, signOut, FirebaseError } from '../../utils/firebase';
import { useNavigate, Outlet } from 'react-router-dom';

export const Header: FC = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const handleSignOut = (): void => {
    try {
      signOut(auth)
        .then(() => {
          console.log('サインアウト');
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e);
      }
    }
  };

  return (
    <header>
      <div>
        {userContext.state.id ? (
          <button onClick={handleSignOut}>サインアウト</button>
        ) : (
          'ログアウト中'
        )}
      </div>
      <div>
        <button
          onClick={() => {
            navigate('/profile/update');
          }}
        >
          プロフィール編集
        </button>
      </div>
      <Outlet />
    </header>
  );
};
