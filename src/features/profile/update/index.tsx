import {
  type FC,
  type FormEvent,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
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
import { type USER_TYPE } from '../../../type';
import Input from '../../../components/input/index';
import Button from '../../../components/button/index';
import classes from './index.module.css';
import NoImage from '../../../assets/images/no_image.jpg';
import { useNavigate } from 'react-router-dom';

const index: FC = () => {
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  const state: USER_TYPE = useContext(UserContext).state;
  const [name, setName] = useState<string>('');
  const [birthOfDate, setBirthOfDate] = useState<string>('');
  const [icon, setIcon] = useState<File | null>(null);
  const [preIcon, setPreIcon] = useState<string>('');
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

  const updateProfile = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    try {
      if (icon) {
        const fileName = createRandomChar();
        const imageRef = ref(storage, `icon/${fileName}`);
        uploadBytes(imageRef, icon)
          .then(() => {
            setDoc(doc(db, 'profiles', state.id), {
              name: name,
              icon: fileName,
              birthOfDate: birthOfDate,
              gender: gender,
            })
              .then(() => {
                toast.dispatch({
                  type: 'SHOW_SUCCEEDED_TOAST',
                  payload: {
                    message: 'プロフィールを更新しました',
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
        const deleteRef = ref(storage, `icon/${state.icon}`);
        deleteObject(deleteRef).catch((e) => {
          throw new Error(e);
        });
      } else {
        setDoc(doc(db, 'profiles', state.id), {
          name: name,
          icon: '',
          birthOfDate: birthOfDate,
          gender: gender,
        }).catch(() => {
          throw new Error();
        });
      }
    } catch (err) {
      console.log(err);
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

  useEffect(() => {
    setName(state.name);
    setBirthOfDate(state.birthOfDate);
    setGender(state.gender);
    setNameValidation(state.name);
  }, [state.name]);

  useEffect(() => {
    if (state.icon) {
      const gsReference = ref(
        storage,
        import.meta.env.VITE_APP_FIREBASE_STORAGE_BASE_URL +
          '/icon/' +
          state.icon
      );
      getDownloadURL(gsReference)
        .then((url) => {
          setPreIcon(url);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [state.icon]);

  return (
    <div className='main'>
      <div className={classes.form_wrapper}>
        <form className={classes.form} onSubmit={updateProfile}>
          <div className={classes.image_wrapper}>
            <label className={classes.image_label}>プロフィール画像</label>
            <div className={classes.image_input_wrapper}>
              {icon ? (
                <img
                  className={classes.image}
                  src={icon ? URL.createObjectURL(icon) : NoImage}
                  alt=''
                />
              ) : (
                <img className={classes.image} src={preIcon} alt='' />
              )}
              <input
                className={classes.image_input}
                type='file'
                accept='image/*'
                onChange={handleChangeIcon}
              />
            </div>
          </div>
          <Input
            label='名前'
            type='text'
            placeholder='山田太郎'
            value={name}
            onChangeHandler={handleChangeName}
            valueError={nameError}
          />
          <BirthOfDateSelect
            birthOfDate={state.birthOfDate}
            setBirthOfDate={setBirthOfDate}
          />
          <GenderButton gender={gender} setGender={setGender} />

          <div className={classes.footer}>
            <Button label='更新' disabled={!checkValidParams()} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default index;
