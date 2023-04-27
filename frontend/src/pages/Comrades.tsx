import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';



import Header from '../components/Header';
import { Link, ScrollRestoration, useParams } from "react-router-dom";
import SmartSearch from '../components/SmartSearch';
import MyFriend from '../components/Comrades/MyFriend';
import FriendRequest from '../components/Comrades/FriendRequest';
import FindFriend from '../components/Comrades/FindFriend';

function Comrades () {

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
                                <div className="tab-pane fade show active h-100" id="list-home" role="tabpanel" aria-labelledby="list-home-list">
                                    <div className="card bg-white p-0 m-0 border-1 mb-2 ">
                                        <div className="card-header">
                                            Мои друзья
                                        </div>
                                        <div className="card-body d-flex align-items-center justify-content-between p-2">
                                            <input type="text" className="form-control" />
                                            <button className='btn btn-primary ms-2'>Поиск</button>
                                        </div>
                                    </div>
                                    <MyFriend id='1' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' username='Username' />
                                    <MyFriend id='2' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' username='Username' />
                                    <MyFriend id='3' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' username='Username' />

                                </div>
                                <div className="tab-pane fade h-100" id="list-profile" role="tabpanel" aria-labelledby="list-profile-list">
                                    <div className="card bg-white p-0 m-0 border-1 mb-2 ">
                                        <div className="card-header">
                                            Запросы в друзья
                                        </div>
                                    </div>
                                    <FriendRequest id='1' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' username='Username' />
                                    <FriendRequest id='3' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' username='Username' />
                                    <FriendRequest id='4' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' username='Username' />
                                    <FriendRequest id='5' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' username='Username' />
   
                                </div>
                                <div className="tab-pane fade h-100" id="list-messages" role="tabpanel" aria-labelledby="list-messages-list">
                                    <div className="card bg-white p-0 m-0 border-1 mb-2 ">
                                        <div className="card-header">
                                            Поиск друзей
                                        </div>
                                        <div className="card-body d-flex align-items-center justify-content-between p-2">
                                            <input type="text" className="form-control" />
                                            <button className='btn btn-primary ms-2'>Поиск</button>
                                        </div>
                                    </div>
                                    
                                    <div className="d-flex flex-wrap justify-content-between">
                                        <FindFriend id='1' username='Username' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg'/>
                                        <FindFriend id='2' username='Username' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg'/>
                                        <FindFriend id='3' username='Username' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg'/>
                                    </div>
                                    
                                </div>
                            </div>
                            
                        </div>
                        <div className='col-4 py-3'>
                            <div className="list-group py-0 my-0 rounded-0 box-shadow" id="list-tab" role="tablist">
                                <a className="list-group-item list-group-item-action active" id="list-home-list" data-bs-toggle="list" href="#list-home" role="tab" aria-controls="list-home">Мои друзья</a>
                                <a className="list-group-item list-group-item-action" id="list-profile-list" data-bs-toggle="list" href="#list-profile" role="tab" aria-controls="list-profile">Заявки в друзья</a>
                                <a className="list-group-item list-group-item-action" id="list-messages-list" data-bs-toggle="list" href="#list-messages" role="tab" aria-controls="list-messages">Поиск друзей</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comrades;
