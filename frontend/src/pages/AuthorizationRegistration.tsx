import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import { Link, ScrollRestoration, useParams } from "react-router-dom";
import SmartSearch from '../components/SmartSearch';
import RelatedArticles from '../components/RelatedArticles';
import Comment from '../components/Comment';
import CommunityComment from '../components/Communities/CommunityComment';
import { useNavigate  } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    

    const [auth, authSwitch] = useState(true);
    function authSwitchF(){
        if (auth == false) {
            authSwitch(true)
        } else {
            authSwitch(false)
        }
    }

    const [inputUsername, setInputUsername] = useState('');

    const handleChangeUsername = (event:any) => {
        setInputUsername(event.target.value);
    };

    const [inputPassword, setInputPassword] = useState('');

    const handleChangePassword = (event: any) => {
        setInputPassword(event.target.value);
    };

    function SignIn(event: any) {
        try {
            event.preventDefault();
        } catch (e) {
            console.log(e)
        }
        const username = inputUsername
        const password = inputPassword
        axios.defaults.baseURL = 'http://127.0.0.1:8000'
        axios.post('/api/signin', {
            "username": username,
            "password":password
        }).then(response => {
            
            localStorage.setItem('user_id', response.data.user_id)
            localStorage.setItem('username', response.data.username)
            localStorage.setItem('access_token', response.data.access_token)
            localStorage.setItem('refresh_token', response.data.refresh_token)

            navigate('/');
        })
        .catch(error => {
            if (error.response.status == 400) {
                alert("Неправильный пользователь или пароль.")
            }
            console.log(error)
        });
    }

    function SignUp(event: any) {
        event.preventDefault();
        const username = inputUsername
        const password = inputPassword
        axios.defaults.baseURL = 'http://127.0.0.1:8000'
        axios.post('/api/signup', {
            "username": username,
            "password": password,
            headers: {
                Accept: 'application/json',
            },
        }).then(response => {
            SignIn({})
        }).catch(error => {
            console.log(error)
            if (error.response.status == 400) {
                alert("Неправильный пользователь или пароль.")
            }
            console.log(error)
        });
    }

    return (
        <div className="Home text-black d-flex align-items-center justify-content-center">
            {auth==true?(
                <div className="p-0 m-0 card bg-white w-25">
                    <form className="card-body">
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" id='sign_in_username'>Имя (никнейм)</label>
                            <input type="text" value={inputUsername} onChange={handleChangeUsername} className="form-control" id="exampleFormControlInput1" placeholder="Username" name='username'></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" id='sign_in_password'>Пароль</label>
                            <input type="password" value={inputPassword} onChange={handleChangePassword} className="form-control" id="exampleFormControlInput1" placeholder="Password" name='password'></input>
                        </div>
                        <button className='btn btn-primary w-100' onClick={SignIn}>Авторизоваться</button>
                        <p onClick={authSwitchF} className='opacity-75 w-100 text-center cursor-pointer p-0 m-0 mt-2' title='Регистрация'>Еще не зарегестрированы?</p>
                    </form>
                    
                </div>
            ):(
                <div className="p-0 m-0 card bg-white w-25">
                    <form className="card-body">
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" id='sign_up_username'>Имя (никнейм)</label>
                            <input type="text" value={inputUsername} onChange={handleChangeUsername} className="form-control" id="exampleFormControlInput1" placeholder="Username" name='username'></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" id='sign_up_password'>Пароль</label>
                            <input type="password" value={inputPassword} onChange={handleChangePassword} className="form-control" id="exampleFormControlInput1" placeholder="Password" name='password'></input>
                        </div>
                        <button className='btn btn-primary w-100' onClick={SignUp}>Зарегестрироватья</button>
                        <p onClick={authSwitchF} className='opacity-75 w-100 text-center cursor-pointer p-0 m-0 mt-2' title='Авторизация' >Уже авторизованы?</p>
                    </form>
                    
                </div>
            )}
        </div>
    );
}

export default Home;
