export interface PROFILE_TYPE {
  name: string;
  icon: string;
  birthOfDate: string;
  gender: string;
}

export interface USER_TYPE extends PROFILE_TYPE {
  id: string;
}

export interface BOOK_TYPE {
  title: string;
  author: string;
  text: string;
  image: string;
  uid: string;
}

export interface BOOK_AND_ID_TYPE extends BOOK_TYPE {
  id: string;
}
