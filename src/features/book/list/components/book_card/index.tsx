import { type FC, useEffect, useState, useContext } from 'react';
import { type BOOK_AND_ID_TYPE } from '../../../../../type';
import { storage, ref, getDownloadURL } from '../../../../../utils/firebase';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../../contexts/user';
import classes from './index.module.css';
import NoImage from '../../../../../assets/images/no_image.jpg';

const index: FC<BOOK_AND_ID_TYPE> = (props) => {
  const user = useContext(UserContext);
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
    if (user.state.id === props.uid) {
      navigate('/book/update', { state: props });
    } else {
      navigate('/book/detail', { state: props });
    }
  };

  return (
    <div className={classes.card} onClick={onClick}>
      <img className={classes.image} src={imageUrl || NoImage} alt='' />
      <div className={classes.content_wrapper}>
        <p className={classes.title}>{props.title}</p>
        <p className={classes.author}>{props.author}</p>
      </div>
    </div>
  );
};

export default index;
