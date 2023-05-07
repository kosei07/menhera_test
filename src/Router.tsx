import { createBrowserRouter } from 'react-router-dom';
import SignUp from './features/auth/sign_up/index';
import SignIn from './features/auth/sign_in/index';
import BookCreate from './features/book/create/index';
import BookList from './features/book/list/index';
import BookDetail from './features/book/detail/index';
import Profile from './features/profile/index'
import { AuthGuard } from './utils/auth_guard';

export const Router = createBrowserRouter([
  { path: '/auth/sign_up', element: <SignUp /> },
  { path: '/auth/sign_in', element: <SignIn /> },
  { path: '/profile/create', element: <AuthGuard><Profile /></AuthGuard> },
  { path: '/book/create', element: <AuthGuard><BookCreate /></AuthGuard> },
  { path: '/', element: <AuthGuard><BookList /></AuthGuard> },
  { path: '/book/detail', element: <AuthGuard><BookDetail /></AuthGuard> },
]);
