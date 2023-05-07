import { type FC, type FormEvent, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from '@firebase/util';
import {auth} from '../../../utils/firebase'

const index: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleChangeEmail: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (e) => {
    setEmail(e.currentTarget.value);
  };
  const handleChangePassword: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (e) => {
    setPassword(e.currentTarget.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((e) => {
        if (e instanceof FirebaseError) {
          console.log(e);
        }
      });
  };

  return (
    <form className='form' onSubmit={handleSubmit}>
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
          />
        </div>
      </div>
      <div className='footer'>
        <button type='submit' className='btn'>
          Register
        </button>
      </div>
    </form>
  );
};

export default index;
