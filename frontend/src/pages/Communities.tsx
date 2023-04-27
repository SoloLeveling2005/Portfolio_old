import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import { Link, ScrollRestoration, useParams } from "react-router-dom";
import SmartSearch from '../components/SmartSearch';
import Community from '../components/Communities/Community';

function Communities () {

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
                                            Мои сообщества
                                        </div>
                                        <div className="card-body d-flex align-items-center justify-content-between p-2">
                                            <button className='btn btn-success w-100'>Создать сообщество</button>
                                        </div>
                                    </div>
                                    <Community community_id='1' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' community_title='Title1' signed={true} />
                                    <Community community_id='2' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' community_title='Title2' signed={true} />
                                    <Community community_id='3' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' community_title='Title3' signed={true} />
                                </div>
                                <div className="tab-pane fade h-100" id="list-profile" role="tabpanel" aria-labelledby="list-profile-list">
                                        <div className="card bg-white p-0 m-0 border-1 mb-2 ">
                                            <div className="card-header">
                                                Поиск сообществ
                                            </div>
                                            <div className="card-body d-flex align-items-center justify-content-between p-2">
                                                <input type="text" className="form-control" />
                                                <button className='btn btn-primary ms-2'>Поиск</button>
                                            </div>
                                        </div>
                                    <div className="card mb-1">
                                        <div className="d-flex p-0 m-0 mx-2">
                                            <div className="m-0 d-flex align-items-center justify-content-center">
                                                <img src="http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg" alt="" className='friend-logo rounded-2' />
                                            </div>
                                            <div className="p-0 m-0">
                                                <div className="card-body">
                                                    <h5 className="card-title">Username</h5>
                                                    <a href="#" className="btn btn-primary me-2">Принять заявку</a>
                                                    <a href="#" className="btn btn-danger">В черный список</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade h-100" id="list-messages" role="tabpanel" aria-labelledby="list-messages-list">
                                    <div className="card bg-white p-0 m-0 border-1 mb-2 ">
                                        <div className="card-header">
                                            Рекомендации друзей
                                        </div>
                                    </div>
                                    <div className="card mb-1">
                                        <div className="d-flex p-0 m-0 mx-2">
                                            <div className="m-0 d-flex align-items-center justify-content-center">
                                                <img src="http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg" alt="" className='friend-logo rounded-2' />
                                            </div>
                                            <div className="p-0 m-0">
                                                <div className="card-body">
                                                    <h5 className="card-title">Username</h5>
                                                    <a href="#" className="btn btn-primary me-2">Принять заявку</a>
                                                    <a href="#" className="btn btn-danger">В черный список</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card mb-1">
                                        <div className="d-flex p-0 m-0 mx-2">
                                            <div className="m-0 d-flex align-items-center justify-content-center">
                                                <img src="http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg" alt="" className='friend-logo rounded-2' />
                                            </div>
                                            <div className="p-0 m-0">
                                                <div className="card-body">
                                                    <h5 className="card-title">Username</h5>
                                                    <a href="#" className="btn btn-primary me-2">Принять заявку</a>
                                                    <a href="#" className="btn btn-danger">В черный список</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            
                        </div>
                        <div className='col-4 py-3'>
                            <div className="list-group py-0 my-0 rounded-0 box-shadow" id="list-tab" role="tablist">
                                <a className="list-group-item list-group-item-action active" id="list-home-list" data-bs-toggle="list" href="#list-home" role="tab" aria-controls="list-home">Мои сообщества</a>
                                <a className="list-group-item list-group-item-action" id="list-profile-list" data-bs-toggle="list" href="#list-profile" role="tab" aria-controls="list-profile">Поиск сообществ</a>
                                <a className="list-group-item list-group-item-action" id="list-messages-list" data-bs-toggle="list" href="#list-messages" role="tab" aria-controls="list-messages">Рекомендации друзей</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default Communities;
