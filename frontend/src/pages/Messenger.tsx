import React, { useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import Smart_search from '../components/SmartSearch';
import { Link } from 'react-router-dom';
import UserInfo from '../components/UserInfo';
import ActivityUser from '../components/ActivityUser';
import Dialogue from '../components/Messenger/Dialogue';
import Message from '../components/Messenger/Message';
import MyMessage from '../components/Messenger/MyMessage';
function Messenger() {

    const [chat, switchChat] = useState('');

    function switchChatF (id:string) {
        switchChat(sw => (id))
    }

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
                                <Dialogue title='Title' img_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' id='1' onClick={switchChatF}/>
                                <Dialogue title='Title' img_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' id='2' onClick={switchChatF}/>
                            </div>
                            <div className="col h-100 p-0 m-0">
                                {chat == '' ? (
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
                                            <div className="row p-0 m-0">
                                                <div className="col bg-white py-2">
                                                    <input type="text" className="form-control" />
                                                </div>
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

