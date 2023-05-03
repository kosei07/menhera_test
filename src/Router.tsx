import { createBrowserRouter } from "react-router-dom";
import SignUp from "./features/auth/sign_up/index"
import SignIn from "./features/auth/sign_in/index"
import BookCreate from "./features/book/create/index"
import BookList from "./features/book/list/index"
import BookDetail from "./features/book/detail/index"

export const Router = createBrowserRouter([
  { path: "/auth/sign_up", element: <SignUp /> },
  { path: "/auth/sign_in", element: <SignIn /> },
  { path: "/book/create", element: <BookCreate /> },
  { path: "/", element: <BookList /> },
  { path: "/book/detail", element: <BookDetail /> }
]);
