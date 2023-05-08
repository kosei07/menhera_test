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
import { UserContext } from '../../../contexts/user';
import createRandomChar from '../../../utils/random_char';
import { ToastContext } from '../../../contexts/toast';
import Input from '../../../components/input/index';
import Button from '../../../components/button/index';
import classes from './index.module.css';
import NoImage from '../../../assets/images/no_image.jpg';
import { useNavigate } from 'react-router-dom';

const index: FC = () => {
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  const user = useContext(UserContext);
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.currentTarget.value);
    setTitleValidation(title);
  };
  const handleChangeAuthor = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAuthor(e.currentTarget.value);
    setAuthorValidation(e.currentTarget.value);
  };
  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setText(e.currentTarget.value);
    setTextValidation(e.currentTarget.value);
  };

  const handleChangeIcon = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files !== null) {
      setImage(e.target.files[0]);
    }
  };

  const [titleError, setTitleValidation] = useValidation(
    title,
    'タイトル',
    'text',
    { min: 5, max: 50 }
  );
  const [authorError, setAuthorValidation] = useValidation(
    author,
    '筆者',
    'name'
  );
  const [textError, setTextValidation] = useValidation(
    text,
    'テキスト',
    'text',
    { min: 20, max: 500 }
  );

  const createBook = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    try {
      if (image) {
        const fileName = createRandomChar();
        const imageRef = ref(storage, `book/${fileName}`);
        uploadBytes(imageRef, image)
          .then(() => {
            setDoc(doc(db, 'books', createRandomChar()), {
              title: title,
              author: author,
              text: text,
              image: fileName,
              uid: user.state.id,
            })
              .then(() => {
                toast.dispatch({
                  type: 'SHOW_SUCCEEDED_TOAST',
                  payload: {
                    message: '書籍レビューを作成しました',
                  },
                });
                navigate('/');
              })
              .catch(() => {
                throw new Error();
              });
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        setDoc(doc(db, 'books', createRandomChar()), {
          title: title,
          author: author,
          text: text,
          image: '',
          uid: user.state.id,
        })
          .then(() => {
            toast.dispatch({
              type: 'SHOW_SUCCEEDED_TOAST',
              payload: {
                message: '書籍レビューを作成しました',
              },
            });
            navigate('/');
          })
          .catch(() => {
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
    return !titleError && !authorError && !textError;
  }, [titleError, authorError, textError]);

  return (
    <div className='main'>
      <div className={classes.form_wrapper}>
        <form className={classes.form} onSubmit={createBook}>
          <div className={classes.image_wrapper}>
            <label className={classes.image_label}>書籍画像</label>
            <div className={classes.image_input_wrapper}>
              <img
                className={classes.image}
                src={image ? URL.createObjectURL(image) : NoImage}
                alt=''
              />
              <input type='file' accept='image/*' onChange={handleChangeIcon} />
            </div>
          </div>
          <Input
            label='タイトル'
            type='text'
            placeholder='title'
            value={title}
            onChangeHandler={handleChangeTitle}
            valueError={titleError}
          />
          <Input
            label='筆者'
            type='text'
            placeholder='author'
            value={author}
            onChangeHandler={handleChangeAuthor}
            valueError={authorError}
          />
          <Input
            label='感想'
            type='text'
            placeholder='impression'
            value={text}
            onChangeHandler={handleChangeText}
            valueError={textError}
          />
          <div className={classes.footer}>
            <Button label='作成' disabled={!checkValidParams()} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default index;
