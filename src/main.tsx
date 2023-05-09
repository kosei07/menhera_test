import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from './Router.tsx';
import { RouterProvider } from 'react-router-dom';
import UserContextProvider from './contexts/user/index.tsx';
import ToastContextProvider from './contexts/toast/index.tsx';
import LoadingContextProvider from './contexts/loading/index.tsx';
import Toast from './components/toast/index.tsx';
import Loading from './components/loading/index.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LoadingContextProvider>
      <ToastContextProvider>
        <UserContextProvider>
          <Toast />
          <Loading />
          <RouterProvider router={Router} />
        </UserContextProvider>
      </ToastContextProvider>
    </LoadingContextProvider>
  </React.StrictMode>
);
