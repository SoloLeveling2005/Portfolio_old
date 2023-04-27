import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import { Link, ScrollRestoration, useParams } from "react-router-dom";
import SmartSearch from '../components/SmartSearch';
import Community from '../components/Communities/Community';
import Company from '../components/Communities/Company';

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
                                <div className="tab-pane fade show active h-100" id="list-communities" role="tabpanel" aria-labelledby="list-communities-list">
                                    <div className="card bg-white p-0 m-0 border-1 mb-2 ">
                                        <div className="card-header">
                                            Мои сообщества
                                        </div>
                                    </div>
                                    <Community id='1' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' title='Title1' description='Описание сообщества 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' subscribers='100' signed={true} categories={['Учим','Математика']} recommended={false} />
                                    <Community id='2' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' title='Title2' description='Описание сообщества 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' subscribers='1003' signed={true} categories={['Учим','Русский']} recommended={true} />
                                    <Community id='3' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' title='Title3' description='Описание сообщества 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' subscribers='3000' signed={true} categories={['Учим','Физика']} recommended={true} />
                                    

                                </div>
                                <div className="tab-pane fade show h-100" id="list-companies" role="tabpanel" aria-labelledby="list-companies-list">
                                    <div className="card bg-white p-0 m-0 border-1 mb-2 ">
                                        <div className="card-header">
                                            Мои компании
                                        </div>
                                    </div>
                                    <Company id='1' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' title='Title1' description='Описание компании 1.' subscribers='1234' signed={true} categories={['Учим','Математика']} recommended={false} />
                                    <Company id='2' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' title='Title1' description='Описание компании 2.' subscribers='566' signed={true} categories={['Учим','Русский']} recommended={false} />
                                    <Company id='3' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' title='Title1' description='Описание компании 3.' subscribers='900' signed={true} categories={['Учим','Физика']} recommended={true} />
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
                                    <Community id='3' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' title='Title3' description='Описание сообщества 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' subscribers='3000' signed={false} categories={['Учим','Физика']} recommended={false} />
                                    <Company id='1' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' title='Title1' description='Описание компании 1.' subscribers='1234' signed={false} categories={['Учим','Математика']} recommended={false} />

                                </div>
                                <div className="tab-pane fade h-100" id="list-messages" role="tabpanel" aria-labelledby="list-messages-list">
                                    <div className="card bg-white p-0 m-0 border-1 mb-2 ">
                                        <div className="card-header">
                                            Рекомендации друзей
                                        </div>
                                    </div>
                                    <Community id='3' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' title='Title3' description='Описание сообщества 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' subscribers='3000' signed={false} categories={['Учим','Физика']} recommended={false} />
                                    <Company id='1' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' title='Title1' description='Описание компании 1.' subscribers='1234' signed={false} categories={['Учим','Математика']} recommended={false} />
                                </div>
                            </div>
                            
                        </div>
                        <div className='col-4 py-3'>
                            <div className="list-group py-0 my-0 rounded-0 box-shadow" id="list-tab" role="tablist">
                                <a className="list-group-item list-group-item-action active" id="list-communities-list" data-bs-toggle="list" href="#list-communities" role="tab" aria-controls="list-communities">Мои сообщества</a>
                                <a className="list-group-item list-group-item-action" id="list-companies-list" data-bs-toggle="list" href="#list-companies" role="tab" aria-controls="list-companies">Мои компании</a>
                                <a className="list-group-item list-group-item-action" id="list-profile-list" data-bs-toggle="list" href="#list-profile" role="tab" aria-controls="list-profile">Поиск сообществ и компаний</a>
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
