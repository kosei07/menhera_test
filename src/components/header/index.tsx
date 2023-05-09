import { useState, type FC } from 'react';
import { UserContext } from '../../contexts/user';
import { useContext } from 'react';
import { auth, signOut, FirebaseError } from '../../utils/firebase';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import classes from './index.module.css';
import { useWindowSize } from '../../hooks/use_window_size';

interface Props {
  title: string;
}

export const Header: FC<Props> = (props) => {
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState<boolean>(false);
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
      <div className={classes.header_wrapper}>
        <div className={classes.logo}>{props.title}</div>
        {!location.pathname.includes('auth') && (
          <>
            {width > 599 ? (
              <nav className={classes.nav}>
                <ul className={classes.nav_wrapper}>
                  {userContext.state.id && (
                    <>
                      <>
                        {userContext.state.name && (
                          <>
                            <li className={classes.nav_item}>
                              <div
                                onClick={() => {
                                  navigate('/');
                                }}
                              >
                                ホーム
                              </div>
                            </li>
                            <li className={classes.nav_item}>
                              <div
                                onClick={() => {
                                  navigate('/profile/update');
                                }}
                              >
                                プロフィール編集
                              </div>
                            </li>
                            <li className={classes.nav_item}>
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
                      <li className={classes.nav_item}>
                        <div onClick={handleSignOut}>サインアウト</div>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            ) : (
              <nav className={classes.nav}>
                <button
                  className={classes.nav_toggle}
                  aria-expanded='false'
                  type='button'
                  onClick={() => {
                    setOpen((pre) => !pre);
                  }}
                >
                  menu
                </button>
                {open && (
                  <ul className={classes.nav_wrapper}>
                    {userContext.state.id && (
                      <>
                        <>
                          {userContext.state.name && (
                            <>
                              <li className={classes.nav_item}>
                                <div
                                  onClick={() => {
                                    navigate('/');
                                  }}
                                >
                                  ホーム
                                </div>
                              </li>
                              <li className={classes.nav_item}>
                                <div
                                  onClick={() => {
                                    navigate('/profile/update');
                                  }}
                                >
                                  プロフィール編集
                                </div>
                              </li>
                              <li className={classes.nav_item}>
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
                        <li className={classes.nav_item}>
                          <div onClick={handleSignOut}>サインアウト</div>
                        </li>
                      </>
                    )}
                  </ul>
                )}
              </nav>
            )}
          </>
        )}
      </div>
      <Outlet />
    </header>
  );
};
