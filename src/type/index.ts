export interface PROFILE_TYPE {
  name: string;
  icon: string | null;
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
  image: string | null;
  uid: string;
}
