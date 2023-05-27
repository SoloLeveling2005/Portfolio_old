import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  createBrowserRouter,
  redirect,
  Route,
  Router,
  RouterProvider,
  Routes, useNavigate,
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
import axios from "axios";
import API_BASE_URL from "./config";
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

  const [messages, setMessages] = useState<{ message: string; status: number }[]>([]);

  const handleNewMessage = (message: string, status: number) => {
    setMessages(prevMessages => [...prevMessages, { message, status }]);

    setTimeout(()=>{
      setMessages(prevMessages => prevMessages.slice(1));
    }, 5000)
  };

  useEffect(() => {



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

      handleNewMessage(notification.message, 200)

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


    // Получем пришедшие уведомления пока нас не было
    let countGetNotifications = 0
    function GetNotifications() {
      if (countGetNotifications == 2) {
        alert("Ошибка поиска друзей")
        countGetNotifications = 0
        return
      }
      countGetNotifications += 1


      axios.defaults.baseURL = API_BASE_URL
      axios.get(`notification/get_notifications`, { headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')}})
          .then(response => {
            console.log(response.data)
            for (let notification of response.data) {
              handleNewMessage(notification.message, 200)
            }


            // Обнуляем значение
            countGetNotifications = 0
          })
          .catch(error => {
            if (error.request.status === 401) {
              // Если сервер ответил что пользователь не авторизован, отправляем запрос на перезапуск access токена. Если это не помогает то выводим ошибку.
              axios.post('refresh_token', {
                'refresh': localStorage.getItem('refresh_token'),
              })
                .then(response => {
                  //
                  localStorage.setItem('access_token', response.data.access)

                  // Запрашиваем данные снова
                  GetNotifications()
                })
                .catch(error => {
                  console.log(error)
                  handleNewMessage("Ошибка авторизации", 400)
                });
            }
          });

    }
    GetNotifications()

  }, []);
  return (
      <div>
        <section className="notification-section" id="notification-section">
          {messages.map((item, index) => (
              <div>
                {item.status == 202 &&
                    <div key={index} className="alert alert-primary" role="alert">
                      {item.message}
                    </div>
                }
                {item.status == 200 &&
                    <div key={index} className="alert alert-primary" role="alert">
                      {item.message}
                    </div>
                }
                {item.status == 400 &&
                    <div className="alert alert-danger" role="alert">
                      {item.message}
                    </div>
                }
              </div>

          ))}
        </section>
        <RouterProvider router={router} />
      </div>

  );
}

export default App;
