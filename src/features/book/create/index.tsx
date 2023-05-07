import { type FC, type FormEvent, useState, useCallback ,useContext} from 'react';
import { storage, ref, uploadBytes ,db,doc,setDoc } from '../../../utils/firebase';
import { useValidation } from '../../../hooks/use_validation';
import { UserContext } from '../../../contexts/user';
import createRandomChar from '../../../utils/random_char';
import { ToastContext } from '../../../contexts/toast';

const index: FC = () => {
  const toast = useContext(ToastContext)
  const user = useContext(UserContext)
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.currentTarget.value);
    setTitleValidation(title)
  };
  const handleChangeAuthor = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAuthor(e.currentTarget.value);
    setAuthorValidation(e.currentTarget.value)
  };
  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setText(e.currentTarget.value);
    setTextValidation(e.currentTarget.value);
  };

  const handleChangeIcon = (e: React.ChangeEvent<HTMLInputElement>):void => {
    if (e.target.files !== null) {
      setImage(e.target.files[0]);
    }
  };

  const [titleError, setTitleValidation] = useValidation(title, 'タイトル', 'text',{ min:5 , max:50 });
  const [authorError, setAuthorValidation] = useValidation(author, '筆者', 'name');
  const [textError, setTextValidation] = useValidation(text, 'テキスト', 'text', { min:20 , max:500 });

  const createBook = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    try {
      if (image) {
        const fileName = createRandomChar()
        const imageRef = ref(storage, `book/${fileName}`);
        uploadBytes(imageRef, image).then(() => {
          setDoc(doc(db, 'books',createRandomChar()),{
            title: title,
            author: author,
            text: text,
            image: fileName,
            uid: user.state.id
          }).catch(()=>{throw new Error})
        }).catch((e)=>{console.log(e)})
      }else{
        setDoc(doc(db, 'books',createRandomChar()),{
          title: title,
          author: author,
          text: text,
          image: null,
          uid: user.state.id
        }).catch(()=>{throw new Error})
      }
    } catch (err) {
      toast.dispatch({
        type: "SHOW_FAILED_TOAST",
        payload:{
          message: '処理に失敗しました'
        }
      })
    }
  };

  const checkValidParams = useCallback(() => {
    return  !titleError && !authorError && !textError
  }, [titleError,authorError,textError]);
  
  return (
    <form className='form' onSubmit={createBook}>
      <div className='form-body'>
        <div className='image'>
          <img src={image ? URL.createObjectURL(image) : ''} alt='' />
          <input type='file' accept='image/*' onChange={handleChangeIcon} />
        </div>
        <div className='name'>
          <label className='form__label' htmlFor='name'>
            Title
          </label>
          <input
            type='text'
            id='title'
            className='form__input'
            placeholder='Title'
            value={title}
            onChange={handleChangeTitle}
          />
          <p>{titleError}</p>
        </div>
        <div className='name'>
          <label className='form__label' htmlFor='name'>
            Author
          </label>
          <input
            type='text'
            id='title'
            className='form__input'
            placeholder='Title'
            value={author}
            onChange={handleChangeAuthor}
          />
          <p>{authorError}</p>
        </div>
        <div className='name'>
          <label className='form__label' htmlFor='name'>
            Text
          </label>
          <input
            type='text'
            id='text'
            className='form__input'
            placeholder='Text'
            value={text}
            onChange={handleChangeText}
          />
          <p>{textError}</p>
        </div>
      </div>
      <div className='footer'>
        <button type='submit' className='btn' disabled={!checkValidParams()}>
          作成
        </button>
      </div>
    </form>
  );
};

export default index;
