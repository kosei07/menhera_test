import { type FC ,useEffect, useState} from 'react'
import { type BOOK_TYPE } from '../../../../../type'
import { storage,ref,getDownloadURL } from '../../../../../utils/firebase'

const index:FC<BOOK_TYPE> = (props) => {
  const [imageUrl, setImageUrl] = useState<string>("")

useEffect(()=>{
  if(props.image){
    const gsReference = ref(
      storage,
      import.meta.env.VITE_APP_FIREBASE_STORAGE_BASE_URL+'/book/'+props.image
    );
    getDownloadURL(gsReference)
    .then((url) => {
      setImageUrl(url);
    })
  .catch((err) => {console.log(err)});
  }
},[props.image])
  return (
    <div>
      <p>{props.title}</p>
      <p>{props.author}</p>
      <p>{props.text}</p>
      <p>{props.title}</p>
      <img src={imageUrl} alt="" />
    </div>
  )
}

export default index