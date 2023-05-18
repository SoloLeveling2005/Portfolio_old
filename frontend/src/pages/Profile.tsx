import React, { useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import Smart_search from '../components/SmartSearch';
import { Link } from 'react-router-dom';
import UserInfo from '../components/UserInfo';
import ActivityUser from '../components/ActivityUser';
import Comment from '../components/Comment';
import Card from '../components/Card';
import axios from 'axios';

function Home() {
    let user = Object;

    const [nav, switchNav] = useState('profile');

    function switchNavF (event:any) {
        const { value } = event.target;
        switchNav(sw => (value))
    }

    axios.defaults.baseURL = "http://127.0.0.1:8000"
    axios.get(`api/users/get_user/${localStorage.getItem('user_id')}`, { headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')}})
        .then(response => {
            user = response.data
            console.log(user)
        })
        .catch(error => {
            console.log(error)
        });

    return (
        <div className="Home text-white">
            <div className=''>
                <Header page='profile'/>
            </div>
            <div className="w-100 h-100">
                <div className='table container'>
                    <div className="row">
                        <div className='col py-3'>
                            <div className="card m-0 p-3 bg-white mb-3 text-decoration-none text-black pb-2">
                                <div className="card-title">
                                    <img src="https://hsto.org/getpro/habr/avatars/252/fee/ec9/252feeec93d4d2f2d8b57ac5e52fbdda.png" alt="" className='img-normal-50' />
                                    <h4 className='pb-1 mb-0'>{localStorage.getItem('username')}</h4>
                                    <p>Люблю данные и все что с ними связано</p>
                                    <div className='d-flex '>
                                       {nav == 'profile' ? (
                                            <button className='btn btn-primary me-2 ' value='profile' onClick={switchNavF}>Профиль</button>
                                        ):(
                                            <button className='btn me-2' value='profile' onClick={switchNavF}>Профиль</button>
                                        )}
                                        {nav == 'articles' ? (
                                            <button className='btn btn-primary me-2' value='articles' onClick={switchNavF}>Публикации</button>
                                        ):(
                                            <button className='btn me-2' value='articles' onClick={switchNavF}>Публикации</button>
                                        )}
                                        {nav == 'comments' ? (
                                            <button className='btn btn-primary me-2' value='comments' onClick={switchNavF}>Комментарии</button>
                                        ):(
                                            <button className='btn me-2' value='comments' onClick={switchNavF}>Комментарии</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {nav == 'profile' && 
                                <div className="card m-0 p-0 bg-white mb-3 w-100 ">
                                    <div className="card-body">
                                        <h5 className=''>Профиль</h5>
                                        <p>Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание </p>
                                    </div>
                                </div>
                            }   
                            {nav == 'articles' && 
                                <div className="p-0 m-0">
                                    <Card title='Как использовать промты в ChatGPT для генерации кода на Python' img_url='https://hsto.org/r/w1560/getpro/habr/upload_files/a35/c93/4fb/a35c934fb02dcef6687214136bc7f2cc.png' description='
                                    Привет, друзья! Сегодня я хочу рассказать вам о том, как использовать промты в ChatGPT для создания программного кода на Python. Если вы работаете с Python или интересуетесь программированием, то вы, наверняка, знаете, насколько важно уметь быстро и эффективно создавать код.

                                    Для тех, кто не знаком с термином "промт", это специальные подсказки, которые выводятся в интерактивной среде Python и позволяют пользователю быстро и легко вводить команды. Обычно они выводятся в виде текста, который предлагает пользователю варианты продолжения его команды.

                                    Чатбот ChatGPT основан на искусственном интеллекте и способен генерировать текст на основе предыдущих входных данных. Таким образом, мы можем использовать его для генерации промтов для создания кода на Python.

                                    После множества экспериментов и ошибок, я нашел наиболее оптимальный промт для работы с ChatGPT, который позволяет мне полностью автоматизировать процесс разработки программы в соответствии с моим ТЗ. Сейчас я готов поделиться с вами своим опытом.
                                    ' articale_id='1' who='Company' count_likes="12" bookmark_active={false} />
                                </div>
                            }     
                            {nav == 'comments' && 
                                <div className="p-0 m-0">
                                    <Comment id='1' title='Как использовать промты в ChatGPT для генерации кода на Python' comment='Комментарии'/>
                                    <Comment id='2' title='Как использовать промты в ChatGPT для генерации кода на Python' comment='Комментарии'/>
                                    <Comment id='3' title='Как использовать промты в ChatGPT для генерации кода на Python' comment='Комментарии'/>
                                
                                    
                                    
                                </div>
                            }           
                            
                        </div>
                        <div className='col-4 position-relative p-0 m-0'>
                            <div className='padding-top-20-px position-sticky top-0'>
                                <UserInfo country='Россия' registered='22 марта' last_login='сегодня в 01:11' gender="Мужчина" age="24"/>
                                {/* <ActivityUser articles={[{url:'string', title:'string', count_activity:2}]}/> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
