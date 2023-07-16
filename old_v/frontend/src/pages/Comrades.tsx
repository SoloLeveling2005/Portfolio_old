import React, {useContext, useEffect, useRef, useState} from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';



import Header from '../components/Header';
import { Link, ScrollRestoration, useNavigate, useParams } from "react-router-dom";
import SmartSearch from '../components/SmartSearch';
import MyFriend from '../components/Comrades/MyFriend';
import FriendRequest from '../components/Comrades/FriendRequest';
import FindFriend from '../components/Comrades/FindFriend';
import API_BASE_URL from '../config';
import axios from 'axios';

function Comrades () {
    const navigate = useNavigate();

    // Проверку на авторизацию 
    let user = localStorage.getItem('username')
    if (user === null) {
        navigate('/auth')
    }

    // Данные о пользователях с фильтрацией

    const [dataFilterFriends, setDataFilterFriends] = useState([{id:0, username:''}]);

    const handleChangeDataFilterFriends = (data:any) => {
        setDataFilterFriends(data);
    };


    // Данные о пользователях которе отправляли запрос в друзья

    const [dataUsersRequests, setDataUsersRequests] = useState([{subscriber:{id:0,username:''}, user:{id:0,username:''}}]);

    const handleChangeDataUsersRequests = (data:any) => {
        setDataUsersRequests(data);
    };

    // Данные о пользователях которе отправляли запрос в друзья

    const [dataUserFriends, setDataUserFriends] = useState([{subscriber:{id:0,username:''}, user:{id:0,username:''}}]);

    const handleChangeDataUserFriends = (data:any) => {
        setDataUserFriends(data);
    };



    
    // Поле поиска друзей по именин
    const [inputFindFriendByUsername, setInputFindFriendByUsername] = useState('');

    const handleChangeFindFriendByUsername = (event:any) => {
        setInputFindFriendByUsername(event.target.value);
    };

    // Navbar переключатель

    const [nav, switchNav] = useState('myFriends');
    function switchNavF (event:any) {
        const { id } = event.target;
        switchNav(sw => (id))
    }

    // 

    let countGetUserFriends = 0
    function getUserFriends() {
        if (countGetUserFriends == 2) {
            alert("Ошибка поиска друзей")
            countGetUserFriends = 0
            return
        }
        countGetUserFriends += 1
        

        axios.defaults.baseURL = API_BASE_URL
        axios.get(`users/get_my_friends`, { headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')}})
        .then(response => {
            console.log('response.data')
            console.log(response.data.subscription)
            handleChangeDataUserFriends(response.data.subscription)

            
            setTimeout(() => {
                console.log(dataUserFriends)
            }, 300)
            // Обнуляем значение
            countGetUserFriends = 0
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
                    getUserFriends()
                })
                .catch(error => {
                    console.log(error)
                    navigate('/auth');
                });
            }
        });

    }


    // Функция получающая запросы в друзья
    let countGetRequestsToFriend = 0
    function getRequestsToFriend() {
        if (countGetRequestsToFriend == 3) {
            alert("Ошибка поиска запосов в друзья")
            countGetRequestsToFriend = 0
            return
        }
        countGetRequestsToFriend += 1

        axios.defaults.baseURL = API_BASE_URL
        axios.get(`users/get_requests_to_friend`, { headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')}})
        .then(response => {
            console.log(response.data)

            handleChangeDataUsersRequests(response.data.requests_to_friend)

            
            // Обнуляем значение
            countGetRequestsToFriend = 0
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
                    getRequestsToFriend()
                })
                .catch(error => {
                    console.log(error)
                    navigate('/auth');
                });
            }
        });
    }


    // Функция поиска друга
    let countFindFriends = 0
    function findFriends() {
        if (countFindFriends == 2) {
            alert("Ошибка поиска друзей")
            countFindFriends = 0
            return
        }
        countFindFriends += 1
        

        axios.defaults.baseURL = API_BASE_URL
        axios.post(`users/get_find_friends`,{'username':inputFindFriendByUsername}, { headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')}})
        .then(response => {
            console.log(response.data)
            handleChangeDataFilterFriends(response.data.users)
            
            // Обнуляем значение
            countFindFriends = 0
        })
        .catch(error => {
            console.log(error)
            if (error.request.status === 401) {
                // Если сервер ответил что пользователь не авторизован, отправляем запрос на перезапуск access токена. Если это не помогает то выводим ошибку.
                axios.post('refresh_token', {
                    'refresh': localStorage.getItem('refresh_token'),
                })
                .then(response => {
                    // 
                    localStorage.setItem('access_token', response.data.access)

                    // Запрашиваем данные снова
                    findFriends()
                })
                .catch(error => {
                    console.log(error)
                    navigate('/auth');
                });
            }
            
        });

    }

    function updateData() {
        getUserFriends()
        findFriends()
        getRequestsToFriend()
    }

    useEffect(() => {
        updateData()
    }, []);


    return (
        <div className="Home text-black">
            <div className='' >
                <Header page='Communities'/>
            </div>
            <div className="w-100 h-100">
                <div className='table container'>
                    <div className="row">
                        <div className='col py-3'>
                            <div className="tab-content p-0 m-0" id="nav-tabContent">
                                {nav === 'myFriends' &&
                                    <div className="h-100">
                                        <div className="card bg-white p-0 m-0 border-1 mb-2 ">
                                            <div className="card-header">
                                                Мои друзья
                                            </div>
                                            <div className="card-body d-flex align-items-center justify-content-between p-2">
                                                <input type="text" className="form-control" />
                                                <button className='btn btn-primary ms-2'>Поиск</button>
                                            </div>
                                        </div>
                                        {dataUserFriends.map((item, index) => (                                            
                                            <MyFriend parentUpdateData={updateData} key={index} id={item.subscriber.id.toString()} username={item.subscriber.username} logo_url='https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Free-File-Download.png' />
                                        ))}
                                        
                                        {/* <MyFriend id='1' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' username='Username' /> */}
                                        {/* <MyFriend id='2' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' username='Username' /> */}
                                        {/* <MyFriend id='3' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' username='Username' /> */}
                                    </div>
                                }
                                {nav === 'requestsToFriend' &&
                                    <div className="h-100">
                                        <div className="card bg-white p-0 m-0 border-1 mb-2 ">
                                            <div className="card-header">
                                                Запросы в друзья
                                            </div>
                                        </div>
                                        {dataUsersRequests.length == 0 && 
                                            <div className="card bg-white p-0 m-0 border-1 mb-2 ">
                                                <div className="card-header py-4 fs-6">
                                                    Нет запросов в друзья
                                                </div>
                                            </div>
                                        }
                                        {dataUsersRequests.map((item, index) => (
                                            <FriendRequest parentUpdateData={updateData} parentgetRequestsToFriend={getRequestsToFriend} parentGetUserFriends={getUserFriends} key={index} id={item.user.id.toString()} username={item.user.username} logo_url='https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Free-File-Download.png' />
                                        ))}
                                        
    
                                        {/* <FriendRequest id='1' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' username='Username' /> */}
                                        {/* <FriendRequest id='3' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' username='Username' /> */}
                                        {/* <FriendRequest id='4' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' username='Username' /> */}
                                    </div>
                                }
                                {nav === 'findFriends' &&
                                    <div className="h-100">
                                        <div className="card bg-white p-0 m-0 border-1 mb-2 ">
                                            <div className="card-header">
                                                Поиск друзей
                                            </div>
                                            <div className="card-body d-flex align-items-center justify-content-between p-2">
                                                <input type="text" className="form-control" value={inputFindFriendByUsername} onChange={handleChangeFindFriendByUsername} />
                                                <button className='btn btn-primary ms-2' onClick={findFriends} >Поиск</button>
                                            </div>
                                        </div>
                                        
                                        <div className="d-flex flex-wrap justify-content-between">
                                            {dataFilterFriends.map((item, index) => (
                                                <FindFriend parentUpdateData={updateData} parentFindFriends={findFriends} key={index} id={item.id.toString()} username={item.username} logo_url='https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Free-File-Download.png'/>
                                            ))}
                                            {/* <FindFriend id='1' username='Username' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg'/>
                                            <FindFriend id='2' username='Username' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg'/>
                                            <FindFriend id='3' username='Username' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg'/> */}
                                        </div>
                                        
                                    </div>
                                }
                            </div>
                            
                        </div>
                        <div className='col-4 py-3'>
                            <div className="list-group py-0 my-0 rounded-0 box-shadow" id="list-tab" role="tablist">
                                {nav === 'myFriends' ? (
                                    <a className="list-group-item list-group-item-action active" id="list-home-list">Мои друзья</a>
                                ):(
                                    <a className="list-group-item list-group-item-action" id="myFriends" onClick={switchNavF}>Мои друзья</a>
                                )}
                                {nav === 'requestsToFriend' ? (
                                    <a className="list-group-item list-group-item-action active" id="list-profile-list">Заявки в друзья</a>
                                ):(
                                    <a className="list-group-item list-group-item-action" id="requestsToFriend" onClick={switchNavF}>Заявки в друзья</a>
                                )}
                                {nav === 'findFriends' ? (
                                    <a className="list-group-item list-group-item-action active" id="list-messages-list">Поиск друзей</a>
                                ):(
                                    <a className="list-group-item list-group-item-action" id="findFriends" onClick={switchNavF}>Поиск друзей</a>
                                )}
                                
                                
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comrades;
