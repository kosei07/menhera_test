import {
  type FC,
  type FormEvent,
  useState,
  useCallback,
  useContext,
} from 'react';
import {
  storage,
  ref,
  uploadBytes,
  db,
  doc,
  setDoc,
} from '../../../utils/firebase';
import { useValidation } from '../../../hooks/use_validation';
import BirthOfDateSelect from '../components/birth_of_date_select/index';
import GenderButton from '../components/gender_button/index';
import { UserContext } from '../../../contexts/user';
import createRandomChar from '../../../utils/random_char';
import { ToastContext } from '../../../contexts/toast';

const index: FC = () => {
  const toast = useContext(ToastContext);
  const user = useContext(UserContext);
  const [name, setName] = useState<string>('');
  const [birthOfDate, setBirthOfDate] = useState<string>('');
  const [icon, setIcon] = useState<File | null>(null);
  const [gender, setGender] = useState<string>('');

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.currentTarget.value);
    setNameValidation(e.currentTarget.value);
  };

  const handleChangeIcon = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files !== null) {
      setIcon(e.target.files[0]);
    }
  };

  const [nameError, setNameValidation] = useValidation(name, '名前', 'name');

  const createProfile = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    try {
      if (icon) {
        const fileName = createRandomChar();
        const imageRef = ref(storage, `icon/${fileName}`);
        uploadBytes(imageRef, icon)
          .then(() => {
            setDoc(doc(db, 'profiles', user.state.id), {
              name: name,
              icon: fileName,
              birthOfDate: birthOfDate,
              gender: gender,
            }).catch(() => {
              throw new Error();
            });
          })
          .catch(() => {
            throw new Error();
          });
      } else {
        setDoc(doc(db, 'profiles', user.state.id), {
          name: name,
          icon: '',
          birthOfDate: birthOfDate,
          gender: gender,
        }).catch(() => {
          throw new Error();
        });
      }
    } catch (err) {
      toast.dispatch({
        type: 'SHOW_FAILED_TOAST',
        payload: {
          message: '処理に失敗しました',
        },
      });
    }
  };

  const checkValidParams = useCallback(() => {
    return !nameError && birthOfDate && gender;
  }, [nameError, birthOfDate, gender]);

  return (
    <form className='form' onSubmit={createProfile}>
      <div className='form-body'>
        <div className='image'>
          <img src={icon ? URL.createObjectURL(icon) : ''} alt='' />
          <input type='file' accept='image/*' onChange={handleChangeIcon} />
          <button type='submit'>画像を選択</button>
        </div>
        <div className='name'>
          <label className='form__label' htmlFor='name'>
            Name
          </label>
          <input
            type='name'
            id='name'
            className='form__input'
            placeholder='Name'
            value={name}
            onChange={handleChangeName}
          />
          <p>{nameError}</p>
        </div>
        <BirthOfDateSelect setBirthOfDate={setBirthOfDate} />
        <GenderButton gender={gender} setGender={setGender} />
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
