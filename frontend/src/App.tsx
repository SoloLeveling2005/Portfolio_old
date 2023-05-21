import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  createBrowserRouter,
  redirect,
  Route,
  Router,
  RouterProvider,
  Routes,
} from "react-router-dom";
import { Provider, useStore } from 'react-redux'

import "./index.css";
import { useSelector } from 'react-redux';

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
import NewCommunity from './pages/NewCommunity';
import NewArticle from './pages/NewArticle';
import AuthorizationRegistration from './pages/AuthorizationRegistration';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,

  },
  {
    path: "/auth",
    element: <AuthorizationRegistration/>,
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
    path:'/messenger/:messenger_id',
    element: <Messenger/>
  },
  {
    path:'/community/:id',
    element: <Community/>
  },
  {
    path:'/createCommunity',
    element:<NewCommunity/>
  },
  {
    path:'/community/:id/createArticle',
    element:<NewArticle/>
  }
]);
function App() {
  
  return (
    <RouterProvider router={router} />
  );
}

export default App;
