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
import Search from './pages/Search';
import Messenger from './pages/Messenger';
import Comrades from './pages/Comrades'
import Communities from './pages/Communities' 
import Community from './pages/Community';
import Company from './pages/history/Company';
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
  {
    path:'/search',
    element: <Search/>
  },
  {
    path:'/comrades',
    element: <Comrades/>
  },
  {
    path:'/communities',
    element: <Communities/>
  },
  {
    path:'/messenger',
    element: <Messenger/>
  },
  {
    path:'/community/:id',
    element: <Community/>
  }
]);
function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
