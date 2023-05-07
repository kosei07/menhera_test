import { type FC, useEffect, useState } from 'react';
import { type BOOK_AND_ID_TYPE } from '../../../../../type';
import { storage, ref, getDownloadURL } from '../../../../../utils/firebase';
import { useNavigate } from 'react-router-dom';

const index: FC<BOOK_AND_ID_TYPE> = (props) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (props.image) {
      const gsReference = ref(
        storage,
        import.meta.env.VITE_APP_FIREBASE_STORAGE_BASE_URL +
          '/book/' +
          props.image
      );
      getDownloadURL(gsReference)
        .then((url) => {
          setImageUrl(url);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [props.image]);

  const onClick = (): void => {
    navigate('/book/detail', { state: props });
  };

  return (
    <div onClick={onClick}>
      <p>{props.title}</p>
      <p>{props.author}</p>
      <p>{props.text}</p>
      <p>{props.title}</p>
      <img src={imageUrl} alt='' />
    </div>
  );
};

export default index;
