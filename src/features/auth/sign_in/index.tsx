import { type FC, type FormEvent, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword ,FirebaseError} from '../../../utils/firebase';
import { useValidation } from '../../../hooks/use_validation';
import { ToastContext } from '../../../contexts/toast';
const index: FC = () => {
  const toast = useContext(ToastContext)
  const navigate = useNavigate()
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
  const signIn = (e: FormEvent<HTMLFormElement>):void => {
   e.preventDefault()
   signInWithEmailAndPassword(auth, email, password)
   .then(()=>{ navigate('/') })
   .catch(e=>{if (e instanceof FirebaseError) {
    toast.dispatch({
      type: "SHOW_FAILED_TOAST",
      payload:{
        message: "サインインに失敗しました"
      }
    })
  }})
 }
  const checkValidParams = useCallback(() => {
    return !emailError && !passwordError 
  }, [emailError, passwordError]);

  return(<form className='form' onSubmit={signIn}>
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
  </div>
  <div className='footer'>
    <button type='submit' className='btn' disabled={!checkValidParams()}>
      Register
    </button>
  </div>
</form>
  )
};

export default index;
