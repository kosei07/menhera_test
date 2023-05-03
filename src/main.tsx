import React from 'react'
import ReactDOM from 'react-dom/client'
import {Router} from './Router.tsx'
import { RouterProvider } from "react-router-dom";
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={Router} />
  </React.StrictMode>,
)
