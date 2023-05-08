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

const index: FC = () => {
  const toast = useContext(ToastContext);
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
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/');
      })
      .catch((e) => {
        if (e instanceof FirebaseError) {
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
    <form className='form' onSubmit={signIn}>
      <div className='form-body'>
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
      </div>
      <div className='footer'>
        <Button label='サインイン' disabled={!checkValidParams()} />
      </div>
    </form>
  );
};

export default index;
