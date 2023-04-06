import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from 'react-redux'

import "./index.css";

import store from './store/store'
import reportWebVitals from './reportWebVitals';
import Home from './pages/Home';
import User from './pages/User';
import Article from './pages/Article';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,

  },
  {
    path: "/profile",
    element: <Profile/>,
  },
  {
    path: "/user/:id",
    element: <User/>,
  },
  {
    path: "/article/:id",
    element: <Article/>,
  },
  {
    path: "/settings",
    element: <Settings/>,
  },
]);
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>

);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
function createBrowserHistory() {
  throw new Error('Function not implemented.');
}

