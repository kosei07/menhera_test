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
  getDownloadURL,
  uploadBytes,
  db,
  doc,
  setDoc,
  deleteDoc,
  deleteObject,
} from '../../../utils/firebase';
import { useValidation } from '../../../hooks/use_validation';
import { UserContext } from '../../../contexts/user';
import createRandomChar from '../../../utils/random_char';
import { ToastContext } from '../../../contexts/toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { type BOOK_AND_ID_TYPE } from '../../../type';
import Input from '../../../components/input/index';

const index: FC = () => {
  const toast = useContext(ToastContext);
  const navigate = useNavigate();
  const location = useLocation();
  const state: BOOK_AND_ID_TYPE = location.state;
  const user = useContext(UserContext);
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [preImageUrl, setPreImageUrl] = useState<string>('');

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

  const updateBook = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    try {
      if (image) {
        const fileName = createRandomChar();
        const imageRef = ref(storage, `book/${fileName}`);
        uploadBytes(imageRef, image)
          .then(() => {
            setDoc(doc(db, 'books', state.id), {
              title: title,
              author: author,
              text: text,
              image: fileName,
              uid: user.state.id,
            }).catch(() => {
              throw new Error();
            });
          })
          .catch(() => {
            throw new Error();
          });
        const deleteRef = ref(storage, `book/${state.image}`);
        deleteObject(deleteRef).catch((e) => {
          throw new Error(e);
        });
        navigate('/book/update', {
          state: {
            id: state.id,
            title: title,
            author: author,
            text: text,
            image: fileName,
            uid: user.state.id,
          },
        });
      } else {
        setDoc(doc(db, 'books', state.id), {
          title: title,
          author: author,
          text: text,
          image: preImageUrl,
          uid: user.state.id,
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

  const deleteBook = (): void => {
    try {
      deleteDoc(doc(db, 'books', state.id))
        .then(() => {
          if (state.image) {
            const deleteRef = ref(storage, `book/${state.image}`);
            deleteObject(deleteRef)
              .then(() => {
                navigate('/');
              })
              .catch((e) => {
                throw new Error(e);
              });
          }
        })
        .catch((e) => {
          throw new Error(e);
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
    return !titleError && !authorError && !textError;
  }, [titleError, authorError, textError]);

  useEffect(() => {
    if (state) {
      setTitle(state.title);
      setAuthor(state.author);
      setText(state.text);
      setTitleValidation(state.title);
      setAuthorValidation(state.author);
      setTextValidation(state.text);
      setPreImageUrl(state.image);
    } else {
      toast.dispatch({
        type: 'SHOW_FAILED_TOAST',
        payload: {
          message: 'エラーが発生しました',
        },
      });
      navigate('/');
    }
  }, []);

  useEffect(() => {
    if (state?.image) {
      const gsReference = ref(
        storage,
        import.meta.env.VITE_APP_FIREBASE_STORAGE_BASE_URL +
          '/book/' +
          state.image
      );
      getDownloadURL(gsReference)
        .then((url) => {
          setPreImageUrl(url);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div>
      <form className='form' onSubmit={updateBook}>
        <div className='form-body'>
          <div className='image'>
            {image ? (
              <img src={URL.createObjectURL(image)} alt='' />
            ) : (
              <img src={preImageUrl} alt='' />
            )}
            <input type='file' accept='image/*' onChange={handleChangeIcon} />
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
            placeholder='author'
            value={text}
            onChangeHandler={handleChangeText}
            valueError={textError}
          />
        </div>
        <div className='footer'>
          <button type='submit' className='btn' disabled={!checkValidParams()}>
            作成
          </button>
        </div>
      </form>
      <div>
        <button onClick={deleteBook}>削除</button>
      </div>
    </div>
  );
};

export default index;
