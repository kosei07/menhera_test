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

const index: FC = () => {
  const toast = useContext(ToastContext);
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
    try {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const cityRef = doc(db, 'profiles', userCredential.user.uid);
          setDoc(cityRef, {
            name: '',
            icon: '',
            birthOfDate: '',
            gender: '',
          }).catch(() => {
            throw new Error();
          });
        })
        .catch(() => {
          throw new Error();
        });
    } catch (e) {
      toast.dispatch({
        type: 'SHOW_FAILED_TOAST',
        payload: {
          message: '処理に失敗しました',
        },
      });
    }
  };

  const checkValidParams = useCallback(() => {
    return !emailError && !passwordError;
  }, [emailError, passwordError]);

  return (
    <div className='main'>
      <form onSubmit={signUp}>
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
          <Input
            label='確認用パスワード'
            type='password'
            placeholder='pass1234'
            value={confirmPassword}
            onChangeHandler={handleChangeConfirmPassword}
            valueError={
              password !== confirmPassword ? 'パスワードが一致しません' : ''
            }
          />
        </div>
        <div className='footer'>
          <Button label='サインアップ' disabled={!checkValidParams()} />
        </div>
      </form>
    </div>
  );
};

export default index;
