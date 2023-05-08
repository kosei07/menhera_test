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

export const Router = createBrowserRouter([
  { path: '/auth/sign_up', element: <SignUp /> },
  { path: '/auth/sign_in', element: <SignIn /> },
  {
    path: '/profile/create',
    element: (
      <AuthGuard>
        <ProfileCreate />
      </AuthGuard>
    ),
  },
  {
    path: '/profile/update',
    element: (
      <AuthGuard>
        <ProfileUpdate />
      </AuthGuard>
    ),
  },
  {
    path: '/book/create',
    element: (
      <AuthGuard>
        <BookCreate />
      </AuthGuard>
    ),
  },
  {
    path: '/book/detail',
    element: (
      <AuthGuard>
        <BookDetail />
      </AuthGuard>
    ),
  },
  {
    path: '/book/update',
    element: (
      <AuthGuard>
        <BookUpdate />
      </AuthGuard>
    ),
  },
  {
    index: true,
    element: (
      <AuthGuard>
        <BookList />
      </AuthGuard>
    ),
  },
]);
