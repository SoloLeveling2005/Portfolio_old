import React, { useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import Smart_search from '../components/SmartSearch';
import { Link } from 'react-router-dom';
import UserInfo from '../components/UserInfo';
import ActivityUser from '../components/ActivityUser';

function NewCommunity() {

    // navbar 
    const [nav, switchNav] = useState('profile');
    function switchNavF (event:any) {
        const { value } = event.target;
        switchNav(sw => (value))
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
                                    <label htmlFor="exampleInputPassword1" className="form-label ">Название</label>
                                    <input type="password" className="form-control" id="exampleInputPassword1"></input>
                                    <div id="emailHelp" className="form-text">Наименование сообщества.</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label ">Небольшое описание</label>
                                    <input type="password" className="form-control" id="exampleInputPassword1"></input>
                                    <div id="emailHelp" className="form-text">Дайте небольшое описание, в чем суть сообщества.</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label ">Сайт</label>
                                    <input type="password" className="form-control" id="exampleInputPassword1"></input>
                                    <div id="emailHelp" className="form-text">Если у вас имеется сайт укажите его выше.</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label ">Категории</label>
                                    <div className='d-flex'>
                                        <select className="form-select mb-2 me-2" aria-label="Default select example">
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
                                        </select>
                                    </div>
                                    <div id="emailHelp" className="form-text">Выберите под какие категории попадает сообщество.</div>
                                </div>
                                
                                
                            
                                <button type="button" className="btn btn-success mt-3">Создать</button>
                            </form>
                            
                        </div>
                    </div>
                </div>

            </div>
        </div>
                   
    );
}

export default NewCommunity;
