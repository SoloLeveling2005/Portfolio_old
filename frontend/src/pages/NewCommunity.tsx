import React, { useRef, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import Smart_search from '../components/SmartSearch';
import { Link, useNavigate } from 'react-router-dom';
import UserInfo from '../components/UserInfo';
import ActivityUser from '../components/ActivityUser';
import axios from 'axios';
import API_BASE_URL from '../config';

function NewCommunity() {
    const navigate = useNavigate();

    // Проверку на авторизацию 
    let user = localStorage.getItem('username')
    if (user === null) {
        console.log(user)
        navigate('/auth')
    }

    

    // title
    const [inputTitle, setInputTitle] = useState('');
    const handleChangeTitle = (event:any) => {
        setInputTitle(event.target.value);
    };        
    // short_info
    const [inputShortInfo, setInputShortInfo] = useState('');
    const handleChangeShortInfo = (event:any) => {
        setInputShortInfo(event.target.value);
    };        
    // tag1
    const [inputTag1, setInputTag1] = useState('');
    const handleChangeTag1 = (event:any) => {
        setInputTag1(event.target.value);
    };        
    // tag2
    const [inputTag2, setInputTag2] = useState('');
    const handleChangeTag2 = (event:any) => {
        setInputTag2(event.target.value);
    };        
    // tag3
    const [inputTag3, setInputTag3] = useState('');
    const handleChangeTag3 = (event:any) => {
        setInputTag3(event.target.value);
    };    
    
    const [selectedOption, setSelectedOption] = useState('');

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedOption(value);
    };

    // navbar 
    const [nav, switchNav] = useState('profile');
    function switchNavF (event:any) {
        const { value } = event.target;
        switchNav(sw => (value))
    }

    function fCreateCommunity() {
        const inputElement = document.getElementById('file-input');
        // @ts-ignore
        const file = inputElement.files[0];

        if (inputTitle == "" || inputShortInfo == "" || inputTag1 == "" || inputTag2 == "" || inputTag3 == "" || !file) {
            alert("Заполните все поля")
            return
        }
        
        // Формируем заголовок запроса
        const body = {
            title: inputTitle,
            short_info: inputShortInfo,
            image:file,
            tagFirst: inputTag1,
            tagSecond: inputTag2,
            tagThird: inputTag3,
        }
        
        // Делаем запрос на создание сообщества
        axios.defaults.baseURL = API_BASE_URL
        axios.post('community/create_community', body, {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem('access_token'),
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            // Удачное создание.
            
            // Переходим в сообщество.
            navigate(`community/${response.data.community_id}`)
        })
        .catch(error => {
            // Ошибка создания
            if (error.request.status == 401) {
                // Если ошибка авторизации, пробуем перезапустить токен.
                axios.post('refresh_token', {
                    'refresh': localStorage.getItem('refresh_token'),
                })
                .then(response => {
                    // Удачный перезапуск токена. Пробуем сделать запрос на создание сново.
                    
                    // Устаналиваем новый access токен.
                    localStorage.setItem('access_token', response.data.access)
                    
                    // Делаем запрос.
                    axios.post('community/create_community', body, {
                        headers: { 'Authorization': "Bearer " + localStorage.getItem('access_token') },
                    })
                    .then(response => {
                        // Удачное создание.
                        
                        // Переходим в сообщество.
                        navigate(`/community/${response.data.community_id}`)
                    })
                    .catch(error => {
                        // Если ошибка, то отправляем на авторизацию. 
                        if (error.response.status == 401) {
                            navigate('/auth');
                        }
                    });
                })
                .catch(error => {
                    // Если ошибка, то отправляем на авторизацию. 
                    if (error.response.status == 401) {
                        navigate('/auth');
                    }
                });
            }
            console.log(error)
            
        });
    }


    return (
        <div className="Home ">
            <div className=''>
                <Header page='NewCommunity'/>
            </div>
            <div className="w-100 h-100 pb-3">
                <div className="container">
                    <div className="card m-0 p-3 bg-white my-3 text-decoration-none text-black">
                        <div className="card-body ps-0 pt-0 mt-0">
                            <h5 className="card-title mb-3">Создание сообщества</h5>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="titleInput" className="form-label ">Название</label>
                                    <input type="text" className="form-control" id="titleInput" value={inputTitle} onChange={handleChangeTitle}></input>
                                    <div id="emailHelp" className="form-text">Наименование сообщества.</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="shortInfoInput" className="form-label ">Небольшое описание</label>
                                    <input type="text" className="form-control" id="shortInfoInput" value={inputShortInfo} onChange={handleChangeShortInfo}></input>
                                    <div id="emailHelp" className="form-text">Дайте небольшое описание, в чем суть сообщества.</div>
                                </div>
                                <div className="mb-3 mt-4">
                                    <label htmlFor="file-input" className="form-label">Выберите аватарку</label>
                                    <input className="form-control btn" type="file" accept="image/*" id="file-input" placeholder='Фаил не выбран' readOnly></input>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label ">Категории</label>
                                    <div className='d-flex'>
                                        <input type="text" className='form-control me-2' placeholder='Первая' value={inputTag1} onChange={handleChangeTag1}/>
                                        <input type="text" className='form-control me-2' placeholder='Вторая' value={inputTag2} onChange={handleChangeTag2}/>
                                        <input type="text" className='form-control' placeholder='Третья' value={inputTag3} onChange={handleChangeTag3}/>
                                        {/* <select className="form-select mb-2 me-2" aria-label="Default select example">
                                            <option selected>Не выбрано</option>
                                            <option value="1">Разработка</option>
                                            <option value="2">Дизайн</option>
                                            <option value="3">Инженерия</option>
                                            <option value="3">Строительство</option>
                                            <option value="3">Моделирование</option>
                                            <option value="3">3Д дизайн</option>
                                        </select>
                                        <select className="form-select mb-2 me-2" aria-label="Default select example">
                                            <option selected>Не выбрано</option>
                                            <option value="1">Разработка</option>
                                            <option value="2">Дизайн</option>
                                            <option value="3">Инженерия</option>
                                            <option value="3">Строительство</option>
                                            <option value="3">Моделирование</option>
                                            <option value="3">3Д дизайн</option>
                                        </select>
                                        <select className="form-select mb-2" aria-label="Default select example">
                                            <option selected>Не выбрано</option>
                                            <option value="1">Разработка</option>
                                            <option value="2">Дизайн</option>
                                            <option value="3">Инженерия</option>
                                            <option value="3">Строительство</option>
                                            <option value="3">Моделирование</option>
                                            <option value="3">3Д дизайн</option>
                                        </select> */}
                                    </div>
                                    <div id="emailHelp" className="form-text">Укажите под какие категории попадает сообщество.</div>
                                </div>
                                
                                
                            
                                <button type="button" className="btn btn-success mt-3" onClick={fCreateCommunity} >Создать</button>
                            </form>
                            
                        </div>
                    </div>
                </div>

            </div>
        </div>
                   
    );
}

export default NewCommunity;
