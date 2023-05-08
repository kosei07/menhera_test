import { type FC } from 'react';
import { UserContext } from '../../contexts/user';
import { useContext } from 'react';
import { auth, signOut, FirebaseError } from '../../utils/firebase';
import { useNavigate, Outlet } from 'react-router-dom';
import classes from './index.module.css';

interface Props {
  title: string;
}

export const Header: FC<Props> = (props) => {
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
    <header className={classes.header}>
      <div className={classes.header__wrapper}>
        <div className={classes.logo}>{props.title}</div>
        <nav className={classes.nav}>
          <button
            className={classes.nav__toggle}
            aria-expanded='false'
            type='button'
          >
            menu
          </button>
          <ul className={classes.nav__wrapper}>
            {userContext.state.id && (
              <>
                <>
                  {userContext.state.name && (
                    <>
                      <li className={classes.nav__item}>
                        <div
                          onClick={() => {
                            navigate('/');
                          }}
                        >
                          ホーム
                        </div>
                      </li>
                      <li className={classes.nav__item}>
                        <div
                          onClick={() => {
                            navigate('/profile/update');
                          }}
                        >
                          プロフィール編集
                        </div>
                      </li>
                      <li className={classes.nav__item}>
                        <div
                          onClick={() => {
                            navigate('/book/create');
                          }}
                        >
                          書籍レビュー作成
                        </div>
                      </li>
                    </>
                  )}
                </>
                <li className={classes.nav__item}>
                  <div onClick={handleSignOut}>サインアウト</div>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
      <Outlet />
    </header>
  );
};
