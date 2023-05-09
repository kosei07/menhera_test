import { type FC, useEffect, useState } from 'react';
import {
  db,
  collection,
  getDocs,
  query,
  type CollectionReference,
} from '../../../utils/firebase';
import type { BOOK_TYPE, BOOK_AND_ID_TYPE } from '../../../type/index';
import BookCard from './components/book_card/index';
import classes from './index.module.css';

const index: FC = () => {
  const shopsColRef = query(
    collection(db, 'books') as CollectionReference<BOOK_TYPE>
  );
  const [books, setBooks] = useState<BOOK_AND_ID_TYPE[]>([]);

  const fetchBooks = (): void => {
    const docDatas: BOOK_AND_ID_TYPE[] = [];
    getDocs(shopsColRef)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          docDatas.push({ ...doc.data(), id: doc.id });
        });
      })
      .then(() => {
        setBooks(docDatas);
      })
      .catch(() => {
        throw new Error();
      });
  };
  useEffect(() => {
    fetchBooks();
  }, []);
  return (
    <div className='main'>
      <div className={classes.books_wrapper}>
        {books.map(function (book, index) {
          return (
            <div key={index}>
              <BookCard
                id={book.id}
                title={book.title}
                author={book.author}
                text={book.text}
                image={book.image}
                uid={book.uid}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default index;
