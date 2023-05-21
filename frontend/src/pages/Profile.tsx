import React, { useState } from 'react';
import { useEffect } from 'react';

import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import UserInfo from '../components/UserInfo';
import Comment from '../components/Comment';
import Card from '../components/Card';
import axios from 'axios';
import API_BASE_URL from '../config.jsx'

function Home() {
    const navigate = useNavigate();

    // Проверку на авторизацию 
    let user = localStorage.getItem('username')
    if (user === null) {
        console.log(user)
        navigate('/auth')
    }

    
    const gender: boolean | undefined = undefined;
    // let data = {
    //     additional_information: {
    //         id: '',
    //         instagram_page: '',
    //         other_info: '',
    //         telegram_profile_id: '',
    //         telegram_profile_link: '',
    //         vk_page: '',
    //         website: ''
    //     },
    //     articles: [],
    //     comments: [],
    //     communities: [{},{}],
    //     profile: {
    //         location: '',
    //         birthday: '',
    //         gender: '',
    //         last_login: '',
    //         registered: '',
    //         short_info:''
    //     },
    //     user:{}
    // };
    const [data, setData] = useState({
        additional_information: {
            id: '',
            instagram_page: '',
            other_info: '',
            telegram_profile_id: '',
            telegram_profile_link: '',
            vk_page: '',
            website: ''
        },
        articles: [],
        comments: [],
        communities: [{
            id:0,
            title: '',
            short_info: '',
            location: '',
            description: '',
            created_at: ''
        }],
        profile: {
            location: '',
            birthday: '',
            gender: gender,
            last_login: '',
            registered: '',
            short_info:''
        },
        user: {},
        userAvatarUrl: ''
    });

    // Переключатель

    const [nav, switchNav] = useState('profile');

    function switchNavF (event:any) {
        const { value } = event.target;
        switchNav(sw => (value))
    }

    // Вызываем один раз.
    useEffect(() => {
        // Получаем информацию о пользователе
        axios.defaults.baseURL = API_BASE_URL
        axios.get(`users/get_user/${localStorage.getItem('user_id')}`, { headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')}})
        .then(response => {
            console.log(response.data)
            setData(response.data)
        })
        .catch(error => {
            if (error.request.status === 401) {
                // Если сервер ответил что пользователь не авторизован, отправляем запрос на перезапуск access токена. Если это не помогает то выводим ошибку.
                axios.post('refresh_token', {
                    'refresh': localStorage.getItem('refresh_token'),
                })
                .then(response => {
                    // 
                    localStorage.setItem('access_token', response.data.access)

                    // Запрашиваем данные снова
                    axios.get(`api/users/get_user/${localStorage.getItem('user_id')}`, { headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')}})
                    .then(response => {
                        console.log(response.data)
                        setData(response.data)
                        console.log(data)
                    })
                    .catch(error => {
                        if (error.response.status === 401) {
                            navigate('/auth');
                        }
                    });
                })
                .catch(error => {
                    console.log(error)
                    navigate('/auth');
                });
            }
        });
    }, []);

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
                                    <img src={data.userAvatarUrl == '' || data.userAvatarUrl == null ? 'https://hsto.org/getpro/habr/avatars/252/fee/ec9/252feeec93d4d2f2d8b57ac5e52fbdda.png' : API_BASE_URL+ data.userAvatarUrl} alt="" className='img-normal-50' />
                                    <h4 className='pb-1 mb-0'>{localStorage.getItem('username')}</h4>
                                    {data.profile.short_info === '' || data.profile.short_info === null ? (
                                        null  
                                    ): (
                                        <p>{data.profile.short_info}</p>    
                                    )}
                                    
                                    <div className='d-flex '>
                                       {nav === 'profile' ? (
                                            <button className='btn btn-primary me-2 ' value='profile' onClick={switchNavF}>Профиль</button>
                                        ):(
                                            <button className='btn me-2' value='profile' onClick={switchNavF}>Профиль</button>
                                        )}
                                        {nav === 'articles' ? (
                                            <button className='btn btn-primary me-2' value='articles' onClick={switchNavF}>Публикации</button>
                                        ):(
                                            <button className='btn me-2' value='articles' onClick={switchNavF}>Публикации</button>
                                        )}
                                        {nav === 'comments' ? (
                                            <button className='btn btn-primary me-2' value='comments' onClick={switchNavF}>Комментарии</button>
                                        ):(
                                            <button className='btn me-2' value='comments' onClick={switchNavF}>Комментарии</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {nav === 'profile' && 
                                <div className="card m-0 p-0 bg-white mb-3 w-100 ">
                                    <div className="card-body">
                                        <h5 className='mb-4'>Профиль</h5>
                                        
                                        <div className='p-0 m-0'>
                                            <h6 className='mb-0'>О себе</h6>
                                            <div className='d-flex'>
                                                <p>
                                                    {data.additional_information.other_info === null || data.additional_information.other_info === '' ? (
                                                        <div>
                                                            Не заполнено
                                                        </div>
                                                    ): (
                                                        <div>
                                                            {data.additional_information.other_info}
                                                        </div>        
                                                    )}
                                                    
                                                </p>
                                            </div>
                                        </div>
                                        <div className='mb-3 pb-1'>
                                            <h6 className='mb-1'>Состоит в сообществах</h6>
                                            {data.communities.length === 0 ? (
                                                <div className='m-0 p-0'>
                                                    Не состоит в сообществах
                                                </div>
                                            ): (
                                                <div className='d-flex w-100 flex-wrap'>
                                                    {data.communities.map((item, index) => (
                                                        <div>
                                                            <Link to={`/community/${item.id}`} className='btn btn-secondary me-1 px-4 mb-1'>{item.title}</Link>    
                                                        </div>
                                                                                                                 
                                                    ))}

                                                </div>  
                                            )}
                                        </div>
                                        

                                        <h6 className='mb-0'>Информация</h6>
                                        <div className='table pt-1'>
                                            <div className="row my-1">
                                                <div className="col">
                                                    Сайт
                                                </div>
                                                <div className="col">
                                                    {data.additional_information.website === null || data.additional_information.website === '' ? (
                                                        <div className='p-0 m-0 py-1'>
                                                            Нет
                                                        </div>
                                                    ): (
                                                        <div>
                                                            <a href={data.additional_information.website}>{data.additional_information.website}</a>
                                                        </div>        
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row my-1">
                                                <div className="col">
                                                    ВК
                                                </div>
                                                <div className="col">
                                                    {data.additional_information.vk_page === null || data.additional_information.vk_page === '' ? (
                                                        <div className='p-0 m-0 py-1'>
                                                            Нет 
                                                        </div>
                                                    ): (
                                                        <div>
                                                            <a href={data.additional_information.vk_page}>{ data.additional_information.vk_page }</a>
                                                        </div>        
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row my-1">
                                                <div className="col">
                                                    Телеграмм
                                                </div>
                                                <div className="col">
                                                    {data.additional_information.telegram_profile_link === null || data.additional_information.vk_page === '' ? (
                                                        <div className='p-0 m-0 py-1'>
                                                            Нет 
                                                        </div>
                                                    ): (
                                                        <div>
                                                            <a href={ data.additional_information.telegram_profile_link }>{ data.additional_information.telegram_profile_link }</a>
                                                        </div>        
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            }   
                            {nav === 'articles' && 
                                <div className="p-0 m-0">
                                    {data.articles.length === 0 ? (
                                        <div className="card m-0 p-0 bg-white mb-3 w-100 ">
                                            <div className="card-body">
                                                <h6 className='p-0 m-0 fs-6'>Пользователь не создавал статей</h6>
                                            </div>
                                        </div>
                                        
                                    ): (
                                        <div className='d-flex w-100 flex-wrap'>
                                            {data.communities.map((item, index) => (
                                                <Card title='1' img_url='' description='' articale_id='1' who='Company' count_likes="12" bookmark_active={false} />                                                           
                                            ))}

                                        </div>  
                                    )}

                                    {/* <Card title='Как использовать промты в ChatGPT для генерации кода на Python' img_url='https://hsto.org/r/w1560/getpro/habr/upload_files/a35/c93/4fb/a35c934fb02dcef6687214136bc7f2cc.png' description='
                                    Привет, друзья! Сегодня я хочу рассказать вам о том, как использовать промты в ChatGPT для создания программного кода на Python. Если вы работаете с Python или интересуетесь программированием, то вы, наверняка, знаете, насколько важно уметь быстро и эффективно создавать код.

                                    Для тех, кто не знаком с термином "промт", это специальные подсказки, которые выводятся в интерактивной среде Python и позволяют пользователю быстро и легко вводить команды. Обычно они выводятся в виде текста, который предлагает пользователю варианты продолжения его команды.

                                    Чатбот ChatGPT основан на искусственном интеллекте и способен генерировать текст на основе предыдущих входных данных. Таким образом, мы можем использовать его для генерации промтов для создания кода на Python.

                                    После множества экспериментов и ошибок, я нашел наиболее оптимальный промт для работы с ChatGPT, который позволяет мне полностью автоматизировать процесс разработки программы в соответствии с моим ТЗ. Сейчас я готов поделиться с вами своим опытом.
                                    ' articale_id='1' who='Company' count_likes="12" bookmark_active={false} /> */}
                                </div>
                            }     
                            {nav === 'comments' && 
                                <div className="p-0 m-0">
                                    {data.comments.length === 0 ? (
                                        <div className="card m-0 p-0 bg-white mb-3 w-100 ">
                                            <div className="card-body">
                                                <h6 className='p-0 m-0 fs-6'>Пользователь не оставлял комментриев</h6>
                                            </div>
                                        </div>
                                    ): (
                                        <div className='d-flex w-100 flex-wrap'>
                                            {data.communities.map((item, index) => (
                                                <Comment id='1' title='1' comment='1'/>                                                          
                                            ))}

                                        </div>  
                                    )}

                                    
                                    {/* <Comment id='1' title='Как использовать промты в ChatGPT для генерации кода на Python' comment='Комментарии'/>
                                    <Comment id='2' title='Как использовать промты в ChatGPT для генерации кода на Python' comment='Комментарии'/>
                                    <Comment id='3' title='Как использовать промты в ChatGPT для генерации кода на Python' comment='Комментарии'/> */}
                                
                                    
                                    
                                </div>
                            }           
                            
                        </div>
                        <div className='col-4 position-relative p-0 m-0'>
                            <div className='padding-top-20-px position-sticky top-0'>
                                <UserInfo
                                    country={data.profile.location}
                                    gender={data.profile.gender == null ? null : data.profile.gender == true ? "Мужской" : "Женский" }
                                    age={data.profile.birthday}
                                    registered={data.profile.registered}
                                    last_login={data.profile.last_login} // 'сегодня в 01:11'
                                />
                                

                                {/* <UserInfo country='Россия' registered='22 марта' last_login='сегодня в 01:11' gender="Мужчина" age="24"/> */}
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
