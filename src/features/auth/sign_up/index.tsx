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
    <form className='form' onSubmit={signUp}>
      <div className='form-body'>
        <div className='email'>
          <label className='form__label' htmlFor='email'>
            Email
          </label>
          <input
            type='email'
            id='email'
            className='form__input'
            placeholder='Email'
            value={email}
            onChange={handleChangeEmail}
          />
          <p>{emailError}</p>
        </div>
        <div className='password'>
          <label className='form__label' htmlFor='password'>
            Password
          </label>
          <input
            className='form__input'
            type='password'
            id='password'
            placeholder='Password'
            value={password}
            onChange={handleChangePassword}
          />
          <p>{passwordError}</p>
        </div>
        <div className='confirm-password'>
          <label className='form__label' htmlFor='confirmPassword'>
            Confirm Password
          </label>
          <input
            className='form__input'
            type='password'
            id='confirmPassword'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={handleChangeConfirmPassword}
          />
          <p>{password !== confirmPassword && 'パスワードが一致しません'}</p>
        </div>
      </div>
      <div className='footer'>
        <button type='submit' className='btn' disabled={!checkValidParams()}>
          Register
        </button>
      </div>
    </form>
  );
};

export default index;
