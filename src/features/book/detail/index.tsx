import { type FC, useEffect, useState } from 'react';
import { type BOOK_AND_ID_TYPE } from '../../../type';
import { storage, ref, getDownloadURL } from '../../../utils/firebase';
import { useLocation } from 'react-router-dom';
import classes from './index.module.css';
import NoImage from '../../../assets/images/no_image.jpg';

const index: FC = () => {
  const location = useLocation();
  const state: BOOK_AND_ID_TYPE = location.state;

  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (state.image) {
      const gsReference = ref(
        storage,
        import.meta.env.VITE_APP_FIREBASE_STORAGE_BASE_URL +
          '/book/' +
          state.image
      );
      getDownloadURL(gsReference)
        .then((url) => {
          setImageUrl(url);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [state.image]);
  return (
    <div className='main'>
      <div className={classes.detail_wrapper}>
        <div className={classes.detail}>
          <img className={classes.image} src={imageUrl || NoImage} alt='' />
          <div className={classes.detail_text}>
            <p>
              タイトル：<span>{state.title}</span>
            </p>
            <p>
              筆者：<span>{state.author}</span>
            </p>
            <p>
              感想：<span>{state.text}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
