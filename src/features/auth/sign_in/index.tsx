import {
  type FC,
  type FormEvent,
  useState,
  useCallback,
  useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  auth,
  signInWithEmailAndPassword,
  FirebaseError,
} from '../../../utils/firebase';
import { useValidation } from '../../../hooks/use_validation';
import { ToastContext } from '../../../contexts/toast';
import Input from '../../../components/input/index';
import Button from '../../../components/button/index';
import classes from './index.module.css';
import { LoadingContext } from '../../../contexts/loading';

const index: FC = () => {
  const toast = useContext(ToastContext);
  const loading = useContext(LoadingContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.currentTarget.value);
    setEmailValidation(e.currentTarget.value);
  };
  const handleChangePassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPassword(e.currentTarget.value);
    setPasswordValidation(e.currentTarget.value);
  };

  const [emailError, setEmailValidation] = useValidation(
    email,
    'メールアドレス',
    'email'
  );
  const [passwordError, setPasswordValidation] = useValidation(
    password,
    'パスワード',
    'password'
  );
  const signIn = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    loading.dispatch({
      type: 'SHOW_LOADING',
      payload: {
        message: 'サインイン中...',
      },
    });
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        loading.dispatch({
          type: 'HIDE_LOADING',
        });
        navigate('/');
      })
      .catch((e) => {
        if (e instanceof FirebaseError) {
          loading.dispatch({
            type: 'HIDE_LOADING',
          });
          toast.dispatch({
            type: 'SHOW_FAILED_TOAST',
            payload: {
              message: 'サインインに失敗しました',
            },
          });
        }
      });
  };
  const checkValidParams = useCallback(() => {
    return !emailError && !passwordError;
  }, [emailError, passwordError]);

  return (
    <div className='main'>
      <div className={classes.form_wrapper}>
        <form className={classes.form} onSubmit={signIn}>
          <p className={classes.title}>サインイン</p>
          <Input
            label='メールアドレス'
            type='email'
            placeholder='example@ex.com'
            value={email}
            onChangeHandler={handleChangeEmail}
            valueError={emailError}
          />
          <Input
            label='パスワード'
            type='password'
            placeholder='pass1234'
            value={password}
            onChangeHandler={handleChangePassword}
            valueError={passwordError}
          />
          <div className={classes.footer}>
            <p
              className={classes.footer_text}
              onClick={() => {
                navigate('/auth/sign_up');
              }}
            >
              アカウントをお持ちでない方はこちら
            </p>
            <Button label='サインイン' disabled={!checkValidParams()} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default index;
