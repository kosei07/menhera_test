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
import { useWindowSize } from '../../../hooks/use_window_size';

const index: FC = () => {
  const { width } = useWindowSize();
  const [dummyContent, setDummyContent] = useState<number>(0);

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

  useEffect(() => {
    const paddingWidth = 2 * (10 * 16);
    const bookIncludeWidth = width - paddingWidth;
    const bookWidth = 10 * 16;
    if (bookIncludeWidth > bookWidth * 5) {
      setDummyContent(4);
    } else if (bookIncludeWidth > bookWidth * 4) {
      setDummyContent(3);
    } else if (bookIncludeWidth > bookWidth * 3) {
      setDummyContent(2);
    } else {
      setDummyContent(1);
    }
  }, [width]);

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
        {[...Array(dummyContent).keys()].map(function (index) {
          return (
            <div key={index}>
              <div className={classes.dummy_content} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default index;
