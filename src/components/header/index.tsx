import { useState, type FC, useContext, useRef, useEffect } from 'react';
import { UserContext } from '../../contexts/user';
import { auth, signOut, FirebaseError } from '../../utils/firebase';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import classes from './index.module.css';
import { useWindowSize } from '../../hooks/use_window_size';
import { ToastContext } from '../../contexts/toast';

interface Props {
  title: string;
}

export const Header: FC<Props> = (props) => {
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useContext(ToastContext);
  const [open, setOpen] = useState<boolean>(false);
  const userContext = useContext(UserContext);
  const handleSignOut = (): void => {
    try {
      signOut(auth).catch(() => {
        throw new Error();
      });
    } catch (e) {
      if (e instanceof FirebaseError) {
        toast.dispatch({
          type: 'SHOW_FAILED_TOAST',
          payload: {
            message: 'サインアウトに失敗しました',
          },
        });
      }
    }
  };

  const insideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = insideRef.current;

    if (!el) return;

    const hundleClickOutside = (e: MouseEvent): void => {
      if (!el?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', hundleClickOutside);

    return () => {
      document.removeEventListener('click', hundleClickOutside);
    };
  }, [insideRef]);

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
                      </>
                      <li className={classes.nav_item}>
                        <div onClick={handleSignOut}>サインアウト</div>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            ) : (
              <nav className={classes.nav} ref={insideRef}>
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
