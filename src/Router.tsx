import { createBrowserRouter } from 'react-router-dom';
import SignUp from './features/auth/sign_up/index';
import SignIn from './features/auth/sign_in/index';
import BookCreate from './features/book/create/index';
import BookList from './features/book/list/index';
import BookDetail from './features/book/detail/index';
import BookUpdate from './features/book/update/index';
import ProfileCreate from './features/profile/create/index';
import ProfileUpdate from './features/profile/update/index';
import { AuthGuard } from './utils/auth_guard';
import { Header } from './components/header';
export const Router = createBrowserRouter([
  {
    path: '/auth/sign_up',
    element: (
      <>
        <Header title='書籍レビューアプリ' />
        <SignUp />
      </>
    ),
  },
  {
    path: '/auth/sign_in',
    element: (
      <>
        <Header title='書籍レビューアプリ' />
        <SignIn />
      </>
    ),
  },
  {
    path: '/profile/create',
    element: (
      <AuthGuard>
        <Header title='プロフィール作成' />
        <ProfileCreate />
      </AuthGuard>
    ),
  },
  {
    path: '/profile/update',
    element: (
      <AuthGuard>
        <Header title='プロフィール更新' />
        <ProfileUpdate />
      </AuthGuard>
    ),
  },
  {
    path: '/book/create',
    element: (
      <AuthGuard>
        <Header title='書籍レビュー作成' />
        <BookCreate />
      </AuthGuard>
    ),
  },
  {
    path: '/book/detail',
    element: (
      <AuthGuard>
        <Header title='書籍レビュー詳細' />
        <BookDetail />
      </AuthGuard>
    ),
  },
  {
    path: '/book/update',
    element: (
      <AuthGuard>
        <Header title='書籍レビュー更新' />
        <BookUpdate />
      </AuthGuard>
    ),
  },
  {
    index: true,
    element: (
      <AuthGuard>
        <Header title='書籍レビュー覧' />
        <BookList />
      </AuthGuard>
    ),
  },
]);
