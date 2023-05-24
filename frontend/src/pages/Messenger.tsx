import React, {useEffect, useRef, useState} from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import Smart_search from '../components/SmartSearch';
import {Link, useNavigate, useParams} from 'react-router-dom';
import UserInfo from '../components/UserInfo';
import ActivityUser from '../components/ActivityUser';
import Dialogue from '../components/Messenger/Dialogue';
import Message from '../components/Messenger/Message';
import MyMessage from '../components/Messenger/MyMessage';
import { io, Socket } from 'socket.io-client';
import axios from "axios";
import API_BASE_URL from "../config";
import message from "../components/Messenger/Message";
function Messenger() {

    const navigate = useNavigate();

    // Проверку на авторизацию
    let user = localStorage.getItem('username')
    if (user === null) {
        navigate('/auth')
    }
    

    //

    // function roomConnect() {
    //     console.log('Start')
    //     const socket = new WebSocket(`ws://localhost:8000/ws/1/`);

    //     socket.onopen = function (e) {
    //         console.log("[open] Соединение установлено");
    //     };

    //     socket.onmessage = function (e) {
    //         const data = JSON.parse(e.data);
    //         console.log(data);
    //         // if(data.message){
    //         //     let html = '<div class="p-4 bg-gray-200 rounded-xl">';
    //         //         html+=  '<p class="font-semibold">' + data.username + '</p>';
    //         //         html +=  '<p>' + data.message + '</p></div>';
    //         //     document.querySelector('#chat-messages').innerHTML += html;
    //         //     scrollToBottom();
    //         // } else{
    //         // }
    //     };

    //     socket.onclose = function (event) {
    //         if (event.wasClean) {
    //             alert(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
    //         } else {
    //             // например, сервер убил процесс или сеть недоступна
    //             // обычно в этом случае event.code 1006
    //             alert('[close] Соединение прервано');
    //         }
    //     };

    //     const sendMessage = (e:any, socket) => {
    //         e.preventDefault();
    //         const message = inputUserMessage;
    //         socket.send(
    //             JSON.stringify({
    //                 message: message,
    //                 username: localStorage.getItem('username'),
    //                 room: chat,
    //             })
    //         );
    //         return false;
    //     };

    //     const handleKeyPress = (event: any) => {
    //         if (event.key === 'Enter') {
    //             sendMessage(event)
    //         }
    //     };

    //     socket.onerror = function (error) {
    //         console.log(`[error]`);
    //     };

    //     return () => {
    //         socket.close();
    //     };

        
    // }

    const blockRef = useRef(null);




    const [data, setData] = useState([{info:{id:0, name:'', slug:''}, interlocutor:{id:0, username:''}}]);
    const [messages, setMessages] = useState([{info:{content:''},user:{username:''}, my:false}]);

    var {messenger_id} = useParams();
    const [chat, switchChat] = useState(`${messenger_id}`);
    
    function switchChatF(id = '0') {
        switchChat(id)
        // roomConnect()
    }


    // Текст нового сообщесния
    const [inputUserMessage, setInputUserMessage] = useState('');

    const handleChangeUserMessage = (event:any) => {
        setInputUserMessage(event.target.value);
    };


    const [socket, setSocket] = useState<WebSocket | null>(null);


    // Отправка сообщения
    const sendMessage = (event: any) => {
        event.preventDefault();
        if (socket) {
            socket.send(
                JSON.stringify({
                    message: inputUserMessage,
                    username: localStorage.getItem('username'),
                    room: chat,
                })
            );
        } else {
            console.log("Соединение не было найдено")
        }
        setInputUserMessage('')
    };
    
    // Функция получающая список чатов
    let countGetChats = 0
    function getChats() {
        if (countGetChats == 3) {
            alert("Ошибка поиска запосов в друзья")
            countGetChats = 0
            return
        }
        countGetChats += 1

        axios.defaults.baseURL = API_BASE_URL
        axios.get(`messenger/get_rooms`, { headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')}})
        .then(response => {
            console.log(response.data)
            setData(response.data.rooms_data)
            // Обнуляем значение
            countGetChats = 0
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
                        getChats()
                    })
                    .catch(error => {
                        console.log(error)
                        navigate('/auth');
                    });
            }
        });
    }


    // Функция получающая список прошлых сообщений
    let counGetMessages = 0
    function getMessages(room_id: number) {
        if (counGetMessages == 3) {
            alert("Ошибка поиска запосов в друзья")
            counGetMessages = 0
            return
        }
        counGetMessages += 1

        axios.defaults.baseURL = API_BASE_URL
        axios.get(`messenger/get_room/${room_id}`, { headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')}})
            .then(response => {
                console.log(response.data)
                setMessages(response.data.messages)
                // Обнуляем значение
                counGetMessages = 0
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
                            getMessages(room_id)
                        })
                        .catch(error => {
                            console.log(error)
                            navigate('/auth');
                        });
                }
            });
    }
    
    
    
    // Подключение к сокету при монтировании компонента
    useEffect(() => {
        getChats()
        if (chat == '0') return;
        const newSocket = new WebSocket(`ws://localhost:8000/ws/${chat}/`);
        setSocket(newSocket)
        
        
        newSocket.onopen = function (e) {
            console.log("[open] Соединение установлено");
        };

        // Подписка на новые сообщения
        newSocket.onmessage = function (e) {
            let new_message = JSON.parse(e.data);
            let myUsername = localStorage.getItem('username')
            let my = new_message.username === myUsername
            setMessages(prevMessages => [...prevMessages, {info:{content:new_message.message},user:{username:new_message.username}, my:my}]);
            console.log(new_message);
            // Функция для прокрутки блока вниз
            if (blockRef.current) {
                // @ts-ignore
                blockRef.current.scrollTop = blockRef.current.scrollHeight;
            }
        };

        // Отключение сокета при размонтировании компонента
        newSocket.onclose = function (event) {
            if (event.wasClean) {
                alert(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
            } else {
                // например, сервер убил процесс или сеть недоступна
                // обычно в этом случае event.code 1006
                alert('[close] Соединение прервано');
            }
        };
    }, [chat]);
        

    return (
        <div className="Messenger text-white">
            <div className=''>
                <Header page='messenger'/>
            </div>
            <div className="w-100 h-100">
                <div className='table container'>
                    <div className="table card align-items-center p-0 m-0 ">
                        <div className="row h-100 w-100 h80">
                            <div className="col-3 border-2 border-end h-100 p-0 h80">
                                <div className='w-100 py-2 ps-2 border-3 border-bottom height-y-55-px d-flex align-items-center '>
                                    <input type="text" className="form-control" />
                                </div>
                                {data.map((item, index)=>(
                                    <Dialogue parentGetMessages={getMessages} title={item.interlocutor.username} img_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' id={item.info.id.toString()} onClick={()=>{switchChatF(item.info.id.toString())}}/>
                                ))}
                                {/*<Dialogue title='Title' img_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' id='2' onClick={()=>{switchChatF('2')}}/>*/}
                            </div>
                            <div className="col h-100 p-0 m-0">
                                {chat == '' || chat == '0' ? (
                                    <div className="d-flex align-items-center justify-content-center h80 p-0 m-0">
                                        <p className="fs-5 opacity-75">Выберите чат</p>
                                    </div>
                                ):(
                                    <div className='w-100 h-100 p-0 m-0'>
                                        <div className='w-100 py-2 ps-2 border-3 border-bottom height-y-55-px d-flex align-items-center '>
                                            {chat}
                                        </div>
                                        <div className='w-100 my-0 py-0 width-max-100 table' id='messages'>
                                            <div className="row height-90 overflow-y-scroll m-0 p-0 py-2">
                                                <div className="col px-1" ref={blockRef}>
                                                    {messages.map((item, index)=>(
                                                        <div className="p-0 m-0">
                                                            {item.my ? (
                                                                <MyMessage message={item.info.content} />
                                                            ):(
                                                                <Message username={item.user.username} message={item.info.content}/>
                                                            )}
                                                        </div>
                                                    ))}

                                                    {/*<MyMessage message='This is some text within a card body.' />*/}
                                                    {/*<MyMessage message='This is some text within a card body.' />*/}
                                                    {/*<MyMessage message='This is some text within a card body.' />*/}
                                                    {/*<Message username='Person' message='With supporting text below as a natural lead-in to additional content.'/>*/}
                                                    {/*<MyMessage message='This is some text within a card body.' />*/}
                                                    {/*<MyMessage message='This is some text within a card body.' />*/}
                                                    {/*<MyMessage message='This is some text within a card body.' />*/}
                                                    {/*<MyMessage message='This is some text within a card body.' />*/}
                                                    {/*<Message username='Person' message='With supporting text below as a natural lead-in to additional content.'/>*/}
                                                    {/*<Message username='Person' message='With supporting text below as a natural lead-in to additional content.'/>*/}
                                                </div>
                                            </div>
                                            <div className="row p-0 m-0 pt-4">
                                                <form onSubmit={sendMessage} className="col bg-white py-2 d-flex justify-content-between align-content-between">
                                                    <input type="text" className="form-control" value={inputUserMessage} onChange={handleChangeUserMessage} />
                                                    <button className='btn btn-primary ms-2 bg-primary' type='submit'>Отправить</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Messenger;

