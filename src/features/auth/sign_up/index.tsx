import {
  type FC,
  type FormEvent,
  useState,
  useCallback,
  useContext,
} from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, doc, setDoc } from '../../../utils/firebase';
import { useValidation } from '../../../hooks/use_validation';
import { ToastContext } from '../../../contexts/toast';
import Input from '../../../components/input/index';
import Button from '../../../components/button/index';
import classes from './index.module.css';
import { useNavigate } from 'react-router-dom';
import { LoadingContext } from '../../../contexts/loading';

const index: FC = () => {
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  const loading = useContext(LoadingContext);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

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
  const handleChangeConfirmPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setConfirmPassword(e.currentTarget.value);
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

  const signUp = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    loading.dispatch({
      type: 'SHOW_LOADING',
      payload: {
        message: 'サインアップ中...',
      },
    });
    try {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const cityRef = doc(db, 'profiles', userCredential.user.uid);
          setDoc(cityRef, {
            name: '',
            icon: '',
            birthOfDate: '',
            gender: '',
          })
            .then(() => {
              loading.dispatch({
                type: 'HIDE_LOADING',
              });
              toast.dispatch({
                type: 'SHOW_SUCCEEDED_TOAST',
                payload: {
                  message: 'アカウントを作成しました',
                },
              });
              navigate('/');
            })
            .catch(() => {
              throw new Error();
            });
        })
        .catch(() => {
          throw new Error();
        });
    } catch (e) {
      loading.dispatch({
        type: 'HIDE_LOADING',
      });
      toast.dispatch({
        type: 'SHOW_FAILED_TOAST',
        payload: {
          message: '処理に失敗しました',
        },
      });
    }
  };

  const checkValidParams = useCallback(() => {
    return !emailError && !passwordError && password === confirmPassword;
  }, [emailError, passwordError, password, confirmPassword]);

  return (
    <div className='main'>
      <div className={classes.form_wrapper}>
        <form className={classes.form} onSubmit={signUp}>
          <p className={classes.title}>サインアップ</p>
          <Input
            label='メールアドレス'
            type='email'
            placeholder='email@example.com'
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
          <Input
            label='確認用パスワード'
            type='password'
            placeholder='pass1234'
            value={confirmPassword}
            onChangeHandler={handleChangeConfirmPassword}
            valueError={
              confirmPassword
                ? password !== confirmPassword
                  ? 'パスワードが一致しません'
                  : ''
                : '確認用パスワードを入力して下さい'
            }
          />
          <div className={classes.footer}>
            <p
              className={classes.footer_text}
              onClick={() => {
                navigate('/auth/sign_in');
              }}
            >
              サインインはこちら
            </p>
            <Button label='サインアップ' disabled={!checkValidParams()} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default index;
