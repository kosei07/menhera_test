import { type FC, useEffect, useState } from 'react';
import { type BOOK_AND_ID_TYPE } from '../../../type';
import { storage, ref, getDownloadURL } from '../../../utils/firebase';
import { useLocation } from 'react-router-dom';

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
    <div>
      <p>{state.title}</p>
      <p>{state.author}</p>
      <p>{state.text}</p>
      <p>{state.title}</p>
      <img src={imageUrl} alt='' />
    </div>
  );
};

export default index;
