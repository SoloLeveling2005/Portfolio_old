import React, { useEffect, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import Smart_search from '../components/SmartSearch';
import { Link, useParams } from 'react-router-dom';
import UserInfo from '../components/UserInfo';
import ActivityUser from '../components/ActivityUser';
import Dialogue from '../components/Messenger/Dialogue';
import Message from '../components/Messenger/Message';
import MyMessage from '../components/Messenger/MyMessage';
import { io, Socket } from 'socket.io-client';
function Messenger() {
    

    

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


    const [rooms, setRooms] = useState<string[]>(['room1', 'room2', 'room3']); // Состояние списка комнат
    const [currentRoom, setCurrentRoom] = useState<string>('room1'); // Состояние текущей комнаты
    const [messages, setMessages] = useState<string[]>([]); // Состояние сообщений
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
    };

    // Подключение к сокету при монтировании компонента
    useEffect(() => {
        if (chat == '0') return;
        const newSocket = new WebSocket(`ws://localhost:8000/ws/${chat}/`);
        setSocket(newSocket)
        
        
        newSocket.onopen = function (e) {
            console.log("[open] Соединение установлено");
        };

        // Подписка на новые сообщения
        newSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            console.log(data);
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
                                {chat}
                                <Dialogue title='Title' img_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' id='1' onClick={()=>{switchChatF('1')}}/>
                                <Dialogue title='Title' img_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' id='2' onClick={()=>{switchChatF('2')}}/>
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
                                                <div className="col px-1">
                                                    <Message username='Person' message='With supporting text below as a natural lead-in to additional content.'/>
                                                    <MyMessage message='This is some text within a card body.' />
                                                    <MyMessage message='This is some text within a card body.' />
                                                    <MyMessage message='This is some text within a card body.' />
                                                    <Message username='Person' message='With supporting text below as a natural lead-in to additional content.'/>
                                                    <MyMessage message='This is some text within a card body.' />
                                                    <MyMessage message='This is some text within a card body.' />
                                                    <MyMessage message='This is some text within a card body.' />
                                                    <MyMessage message='This is some text within a card body.' />
                                                    <Message username='Person' message='With supporting text below as a natural lead-in to additional content.'/>
                                                    <Message username='Person' message='With supporting text below as a natural lead-in to additional content.'/>
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

