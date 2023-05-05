import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import { Link, ScrollRestoration, useParams } from "react-router-dom";
import SmartSearch from '../components/SmartSearch';
import RelatedArticles from '../components/RelatedArticles';
import Comment from '../components/Comment';
import CommunityComment from '../components/Communities/CommunityComment';

function Home () {
    const [auth, authSwitch] = useState(true);
    function authSwitchF(){
        if (auth == false) {
            authSwitch(true)
        } else {
            authSwitch(false)
        }
    }
    return (
        <div className="Home text-black d-flex align-items-center justify-content-center">
            {auth==true?(
                <div className="p-0 m-0 card bg-white w-25">
                    <form className="card-body">
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Имя (никнейм)</label>
                            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Username" name='username'></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Пароль</label>
                            <input type="password" className="form-control" id="exampleFormControlInput1" placeholder="Password" name='password'></input>
                        </div>
                        <button className='btn btn-primary w-100'>Авторизоваться</button>
                        <p onClick={authSwitchF} className='opacity-75 w-100 text-center cursor-pointer p-0 m-0 mt-2' title='Регистрация'>Еще не зарегестрированы?</p>
                    </form>
                    
                </div>
            ):(
                <div className="p-0 m-0 card bg-white w-25">
                    <form className="card-body">
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Имя (никнейм)</label>
                            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Username" name='username'></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Пароль</label>
                            <input type="password" className="form-control" id="exampleFormControlInput1" placeholder="Password" name='password'></input>
                        </div>
                        <button className='btn btn-primary w-100'>Зарегестрироватья</button>
                        <p onClick={authSwitchF} className='opacity-75 w-100 text-center cursor-pointer p-0 m-0 mt-2' title='Авторизация'>Уже авторизованы?</p>
                    </form>
                    
                </div>
            )}
        </div>
    );
}

export default Home;
