import React, {useEffect, useState} from 'react';
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
    element: <Profile/>,
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
  const [messages, setMessages] = useState<string[]>([]);

  const handleNewMessage = (message:string) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (messages.length > 0) {
        setMessages(prevMessages => prevMessages.slice(1));
      }
    }, 3000);


    // Проверяем, зашел ли пользователь в приложение или регестрируется
    let user = localStorage.getItem('username')
    if (user === null) return

    const newSocket = new WebSocket(`ws://localhost:8000/ws/notifications/${localStorage.getItem('user_id')}`);

    newSocket.onopen = function (e) {
      console.log("[open] Соединение установлено");
      // Вдруг сообщество было создано только сейчас при соединении.
    };

    // Подписка на новые сообщения
    newSocket.onmessage = function (e) {
      let notification = JSON.parse(e.data);

      // handleNewMessage()

      console.log(notification);
    };

    newSocket.onclose = function (event) {
      if (event.wasClean) {
        alert(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
      } else {
        // например, сервер убил процесс или сеть недоступна
        // обычно в этом случае event.code 1006
        alert('[close] Соединение прервано');
      }
    };





    return () => {
      clearInterval(timer);
    };
  }, [messages]);



  return (
      <div>
        <section className={"notification-section"} id={"notification-section"}>
          {messages.map((item, index) => (
              <div key={index} className="alert alert-primary" role="alert">
                  {item}
              </div>
          ))}
          {/*<button onClick={handleNewMessage}>New</button>*/}
        </section>
        <RouterProvider router={router} />
      </div>
  );
}

export default App;
