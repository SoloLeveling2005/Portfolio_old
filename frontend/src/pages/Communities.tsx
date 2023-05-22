import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import { Link, ScrollRestoration, useNavigate, useParams } from "react-router-dom";
import SmartSearch from '../components/SmartSearch';
import Community from '../components/Communities/Community';
import Company from '../components/Communities/Company';
import axios from 'axios';
import API_BASE_URL from '../config';

function Communities () {
    const navigate = useNavigate();

    // Проверка на авторизацию 
    
    let user = localStorage.getItem('username')
    if (user === null) {
        console.log(user)
        navigate('/auth')
    }

    
    // Переключатель

    const [nav, switchNav] = useState('myCommunities');
    function switchNavF (event:any) {
        const { id } = event.target;
        switchNav(sw => (id))
    }


    // Input - поиск сообществ

    const [inputFingCommunity, setInputFingCommunity] = useState('');
    const handleChangeInputFingCommunity = (event: any) => {
        setInputFingCommunity(event.target.value);
    };


    // Данные о моих сообществах

    const [dataMyCommunities, setDataMyCommunities] = useState([{id:0, short_info:'', title:''}]);
    const handleChangeDataMyCommunities = (data:any) => {
        setDataMyCommunities(data);
    };


    // Данные о найденных сообществах

    const [dataFindCommunity, setDataFindCommunity] = useState([{id:0, short_info:'', title:''}]);
    const handleChangeDataFindCommunity = (data:any) => {
        setDataFindCommunity(data);
    };



    // Функция получения моих сообществ
    let countMyCommunities = 0
    function MyCommunities() {
        if (countMyCommunities == 2) {
            alert("Ошибка поиска")
            countMyCommunities = 0
            return
        }
        countMyCommunities += 1
        

        axios.defaults.baseURL = API_BASE_URL
        axios.get(`community/get_user_communities`, { headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')}})
        .then(response => {
            console.log(response.data)
            handleChangeDataMyCommunities(response.data.communities)
            // Обнуляем значение count
            countMyCommunities = 0
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
                    MyCommunities()
                })
                .catch(error => {
                    console.log(error)
                    navigate('/auth');
                });
            }
            
        });

    }

    // Функция получения моих сообществ
    let countFindCommunity = 0
    function FindCommunity() {
        if (countFindCommunity == 2) {
            alert("Ошибка поиска")
            countFindCommunity = 0
            return
        }
        countFindCommunity += 1
        

        axios.defaults.baseURL = API_BASE_URL
        axios.post(`community/get_find_communities`, { 'find_text':inputFingCommunity } ,{ headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')}})
        .then(response => {
            console.log(response.data)
            handleChangeDataFindCommunity(response.data.communities)
            // Обнуляем значение count
            countFindCommunity = 0
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
                    FindCommunity()
                })
                .catch(error => {
                    console.log(error)
                    navigate('/auth');
                });
            }
            
        });

    }

    


    useEffect(() => {
        MyCommunities()
        FindCommunity()
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
                                {nav === 'myCommunities' && 
                                    <div className="h-100">
                                        <div className="card bg-white p-0 m-0 border-1 mb-2 ">
                                            <div className="card-header d-flex justify-content-between align-items-center">
                                                Мои сообщества <Link to={'/createCommunity'} className='btn btn-primary p-1 px-2'><small>Добавить</small></Link>
                                            </div>
                                        </div>
                                        {dataMyCommunities.length == 0 && 
                                            <div className="card m-0 p-0 bg-white mb-3 w-100 ">
                                                <div className="card-body">
                                                    <h6 className='p-0 m-0 fs-6'>Пользователь не создавал/входил в сообщества. Вы можете добавить свое первое сообщество войдя в чье то сообщество или создать его кнопкой выше. </h6>
                                                </div>
                                            </div>
                                        }
                                        {dataMyCommunities.map((item, index) => (
                                            <Community id={item.id.toString()} title={item.title} description={item.short_info} subscribers='100' categories={['Учим','Математика']} logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' />
                                        ))}
                                        
                                        {/* <Community id='2' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' title='Title2' description='Описание сообщества 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' subscribers='1003' signed={true} categories={['Учим','Русский']} recommended={true} /> */}
                                        {/* <Community id='3' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' title='Title3' description='Описание сообщества 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' subscribers='3000' signed={true} categories={['Учим','Физика']} recommended={true} /> */}
                                        

                                    </div>
                                }
                                
                                {nav === 'findCommunities' && 
                                    <div className="h-100">
                                        <div className="card bg-white p-0 m-0 border-1 mb-2 ">
                                            <div className="card-header">
                                                Поиск сообществ
                                            </div>
                                            <div className="card-body d-flex align-items-center justify-content-between p-2">
                                                <input type="text" className="form-control" value={inputFingCommunity} onChange={handleChangeInputFingCommunity} />
                                                <button className='btn btn-primary ms-2' onClick={FindCommunity} >Поиск</button>
                                            </div>
                                        </div>
                                        {dataFindCommunity.map((item, index) => (
                                            <Community id={item.id.toString()} title={item.title} description={item.short_info} subscribers='3000' categories={['Учим','Физика']} logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' />
                                        ))}
                                        
                                        {/* <Company id='1' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' title='Title1' description='Описание компании 1.' subscribers='1234' signed={false} categories={['Учим','Математика']} recommended={false} /> */}

                                    </div>
                                }
                                
                                {nav === 'communityWithRecomendations' && 
                                    <div className="h-100">
                                        <div className="card bg-white p-0 m-0 border-1 mb-2 ">
                                            <div className="card-header">
                                                Рекомендации друзей
                                            </div>
                                        </div>
                                        <Community id='3' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' title='Title3' description='Описание сообщества 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' subscribers='3000' categories={['Учим','Физика']}  />
                                        <Company id='1' logo_url='http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg' title='Title1' description='Описание компании 1.' subscribers='1234' signed={false} categories={['Учим','Математика']} recommended={false} />
                                    </div>
                                }
                                
                            </div>
                            
                        </div>
                        <div className='col-4 py-3'>
                            <div className="list-group py-0 my-0 rounded-0 box-shadow" id="list-tab" role="tablist">
                                {/* <a className="list-group-item list-group-item-action active" id="list-communities-list" data-bs-toggle="list" href="#list-communities" role="tab" aria-controls="list-communities">Мои сообщества</a> */}
                                {/* <a className="list-group-item list-group-item-action" id="list-profile-list" data-bs-toggle="list" href="#list-profile" role="tab" aria-controls="list-profile">Поиск сообществ</a> */}
                                {/* <a className="list-group-item list-group-item-action" id="list-messages-list" data-bs-toggle="list" href="#list-messages" role="tab" aria-controls="list-messages">Рекомендации друзей</a> */}

                                {nav === 'myCommunities' ? (
                                    <a className="list-group-item list-group-item-action active" id="list-home-list">Мои сообщества</a>
                                ):(
                                    <a className="list-group-item list-group-item-action" id="myCommunities" onClick={switchNavF}>Мои сообщества</a>
                                )}
                                {nav === 'findCommunities' ? (
                                    <a className="list-group-item list-group-item-action active" id="list-profile-list">Поиск сообществ</a>
                                ):(
                                    <a className="list-group-item list-group-item-action" id="findCommunities" onClick={switchNavF}>Поиск сообществ</a>
                                )}
                                {nav === 'communityWithRecomendations' ? (
                                    <a className="list-group-item list-group-item-action active" id="list-messages-list">Рекомендации друзей</a>
                                ):(
                                    <a className="list-group-item list-group-item-action" id="communityWithRecomendations" onClick={switchNavF}>Рекомендации друзей</a>
                                )}
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default Communities;
