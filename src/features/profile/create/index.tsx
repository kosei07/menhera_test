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
import Input from '../../../components/input/index';
import Button from '../../../components/button/index';
import classes from './index.module.css';
import NoImage from '../../../assets/images/no_image.jpg';
import { useNavigate } from 'react-router-dom';
import { LoadingContext } from '../../../contexts/loading';

const index: FC = () => {
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  const loading = useContext(LoadingContext);
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
    loading.dispatch({
      type: 'SHOW_LOADING',
      payload: {
        message: '作成中...',
      },
    });
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
            })
              .then(() => {
                loading.dispatch({
                  type: 'HIDE_LOADING',
                });
                toast.dispatch({
                  type: 'SHOW_SUCCEEDED_TOAST',
                  payload: {
                    message: 'プロフィールを作成しました',
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
      } else {
        setDoc(doc(db, 'profiles', user.state.id), {
          name: name,
          icon: '',
          birthOfDate: birthOfDate,
          gender: gender,
        })
          .then(() => {
            loading.dispatch({
              type: 'HIDE_LOADING',
            });
            toast.dispatch({
              type: 'SHOW_SUCCEEDED_TOAST',
              payload: {
                message: 'プロフィールを作成しました',
              },
            });
            navigate('/');
          })
          .catch(() => {
            throw new Error();
          });
      }
    } catch (err) {
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
    return !nameError && birthOfDate && gender;
  }, [nameError, birthOfDate, gender]);

  return (
    <div className='main'>
      <div className={classes.form_wrapper}>
        <form className={classes.form} onSubmit={createProfile}>
          <div className={classes.image_wrapper}>
            <label className={classes.image_label}>プロフィール画像</label>
            <div className={classes.image_input_wrapper}>
              <img
                className={classes.image}
                src={icon ? URL.createObjectURL(icon) : NoImage}
                alt=''
              />
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
          <BirthOfDateSelect setBirthOfDate={setBirthOfDate} />
          <GenderButton gender={gender} setGender={setGender} />
          <div className={classes.footer}>
            <Button label='作成' disabled={!checkValidParams()} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default index;
