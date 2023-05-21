import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import { Link, ScrollRestoration, useNavigate, useParams } from "react-router-dom";
import Card from '../components/Card';
import News from '../components/News';
import Advertisement from '../components/Advertisement';
import axios from 'axios';
import API_BASE_URL from '../config';



interface Option {
    value: string;
    label: string;
  }

function Community(props: any) { 
    const navigate = useNavigate();

    // Проверку на авторизацию 
    let user = localStorage.getItem('username')
    if (user === null) {
        console.log(user)
        navigate('/auth')
    }

    
    const { id } = useParams(); 
    

    // Переключатели 

    const [nav, switchNav] = useState('profile');
    function switchNavF (event:any) {
        const { value } = event.target;
        switchNav(sw => (value))
    }

    const [createRole, createRoleChange] = useState(false);
    function createRoleF () {
        createRole == false ? createRoleChange(sw => (true)) : createRoleChange(sw => (false))
    }


    const [createNews, createNewsChange] = useState(false);
    function createNewsF () {
        createNews == false ? createNewsChange(sw => (true)) : createNewsChange(sw => (false))
    }


    // Данные сообщества

    const [data, setData] = useState({
        admin: Boolean,
        signed: Boolean,
        subscribers_count: 1,
        articles: [],
        articles_comments:[],
        community: {
            id: 0,
            location: '',
            description: '',
            created_at: '',
            title: '',
            website: '',
            short_info: ''
        },
        community_avatar: {
            img: ''
        },
        roles: [],
        admin_data: {
            username:''
        }
    });
    

    let countGetCommunity = 0
    function getCommunity() {
        if (countGetCommunity == 3) {
            alert('Ошибка поиска')
            countGetCommunity = 0
            return
        }
        countGetCommunity += 1


        axios.defaults.baseURL = API_BASE_URL
        axios.get(`community/get_community/${id}`, { headers: { 'Authorization': "Bearer " + localStorage.getItem('access_token') } })
        .then(response => {
            console.log(response.data)
            setData(response.data)
            countGetCommunity = 0
        })
        .catch(error => {
            if (error.request.status === 401) {
                axios.post('refresh_token', { 'refresh': localStorage.getItem('refresh_token') })
                .then(response => {
                    localStorage.setItem('access_token', response.data.access)

                    // Запрашиваем данные снова
                    getCommunity()
                })
                .catch(error => { console.log(error); navigate('/auth'); });
            }
        });
    }

    let countCreateRole = 0
    function FCreateRole() {
        if (countCreateRole == 3) {
            alert('Ошибка создания')
            countCreateRole = 0
            return
        }
        countCreateRole += 1


        axios.defaults.baseURL = API_BASE_URL
        axios.get(`community/get_community/${id}`, { headers: { 'Authorization': "Bearer " + localStorage.getItem('access_token') } })
        .then(response => {
            console.log(response.data)
            alert('Роль успешно создана')
            countCreateRole = 0
        })
        .catch(error => {
            if (error.request.status === 401) {
                axios.post('refresh_token', { 'refresh': localStorage.getItem('refresh_token') })
                .then(response => {
                    localStorage.setItem('access_token', response.data.access)

                    // Пробуем еще раз 
                    FCreateRole()
                })
                .catch(error => { console.log(error); navigate('/auth'); });
            }
        });
    }
    
    useEffect(() => {
        getCommunity()
    }, []);




    return (
        <div className="Home text-black">
            <div className='' >
                <Header page='Community'/>
            </div>
            <div className="w-100 h-100 pb-2">
                <div className='container'>
                    <div className="card">
                        <img src="https://hsto.org/getpro/habr/branding/174/2c4/3a5/1742c43a5b504987a0fadf577a0bd4de.png" alt="" className='w-100'/>
                    </div>
                    <div className='table'>
                        <div className="row">
                            <div className='col py-3'>
                                <div className="card m-0 p-3 bg-white mb-3 text-decoration-none text-black pb-2">
                                    <div className="card-title">
                                        <img src={data.community_avatar.img == '' || data.community_avatar.img == null ? 'https://hsto.org/getpro/habr/company/9ed/c74/6b4/9edc746b484c805ecad1f941b5f7068a.png' : API_BASE_URL+ data.community_avatar.img} alt="" className='img-normal-50' />
                                        <h4 className='pb-1 mb-0 mt-1'>{ data.community.title }</h4>
                                        <p>{ data.community.short_info }</p>
                                        <div className='d-flex flex-wrap'>
                                            {nav == 'profile' ? (
                                                <button className='btn btn-primary me-1 px-2 ' value='profile' onClick={switchNavF}>Профиль</button>
                                            ):(
                                                <button className='btn me-1 px-2' value='profile' onClick={switchNavF}>Профиль</button>
                                            )}
                                            {nav == 'articles' ? (
                                                <button className='btn btn-primary me-1 px-2' value='articles' onClick={switchNavF}>Публикации</button>
                                            ):(
                                                <button className='btn me-1 px-2' value='articles' onClick={switchNavF}>Публикации</button>
                                            )}
                                            {nav == 'comments' ? (
                                                <button className='btn btn-primary me-1 px-2' value='comments' onClick={switchNavF}>Комментарии</button>
                                            ):(
                                                <button className='btn me-1 px-2' value='comments' onClick={switchNavF}>Комментарии</button>
                                            )}
                                            {nav == 'news' ? (
                                                <button className='btn btn-primary me-1 px-2' value='news' onClick={switchNavF}>Новости</button>
                                            ):(
                                                <button className='btn me-1 px-2' value='news' onClick={switchNavF}>Новости</button>
                                            )}
                                            {nav == 'participants' ? (
                                                <button className='btn btn-primary me-1 px-2' value='participants' onClick={switchNavF}>Участники</button>
                                            ):(
                                                <button className='btn me-1 px-2' value='participants' onClick={switchNavF}>Участники</button>
                                            )}
                                            {nav == 'chats' ? (
                                                <button className='btn btn-primary me-1 px-2' value='chats' onClick={switchNavF}>Чаты</button>
                                            ):(
                                                <button className='btn me-1 px-2' value='chats' onClick={switchNavF}>Чаты</button>
                                            )}
                                            {nav == 'settings' ? (
                                                <button className='btn btn-primary me-1 px-2' value='settings' onClick={switchNavF}>Настройки</button>
                                            ):(
                                                <button className='btn me-1 px-2' value='settings' onClick={switchNavF}>Настройки</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {nav == 'profile' && 
                                    <div className="card m-0 p-0 bg-white mb-3 w-100">
                                        <div className="card-body">
                                            <h5 className='mb-3'>Профиль</h5>
                                            <div>
                                                <h6 className='mb-0'>Отрасли</h6>
                                                <div className='d-flex'>
                                                    {/* {data.community.description == null || data.community.description == '' ? (
                                                        <span className='p-0 m-0'>Не указано</span>
                                                    ): (
                                                        <span className='p-0 m-0'>{data.community.description}</span>
                                                    )} */}
                                                    <p>Не указано</p>
                                                    {/* <p className=''>Мобильные технологии</p>,<p className='ms-1'>Веб-сервисы</p>,<p className='ms-1'>Игры и развлечения</p> */}
                                                </div>
                                                <h6 className='mb-0'>О сообществе</h6>
                                                <div className='d-flex'>
                                                    <p>
                                                        {data.community.description == null || data.community.description == '' ? (
                                                            <span className='p-0 m-0'>Не указано</span>
                                                        ): (
                                                            <span className='p-0 m-0'>{data.community.description}</span>
                                                        )}
                                                    </p>
                                                </div>
                                                <h6 className='mb-0'>Информация</h6>
                                                <div className='table pt-1'>
                                                    <div className="row my-1">
                                                        <div className="col">
                                                            Сайт
                                                        </div>
                                                        <div className="col">
                                                            {data.community.website == null || data.community.website == '' ? (
                                                                <span className='p-0 m-0'>Не указан</span>
                                                            ): (
                                                                <span className='p-0 m-0'>{data.community.website}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="row my-1">
                                                        <div className="col">
                                                            Дата регистрации
                                                        </div>
                                                        <div className="col">
                                                            {data.community.created_at == null || data.community.created_at == '' ? (
                                                                <span className='p-0 m-0'>Не указан</span>
                                                            ): (
                                                                <span className='p-0 m-0'>{data.community.created_at.substring(0,10)}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="row my-1">
                                                        <div className="col">
                                                            Дата основания
                                                        </div>
                                                        <div className="col">
                                                            15 октября 1998
                                                        </div>
                                                    </div>
                                                    <div className="row my-1">
                                                        <div className="col">
                                                            Местоположение
                                                        </div>
                                                        <div className="col">
                                                            {data.community.location == null || data.community.location == '' ? (
                                                                <span className='p-0 m-0'>Не указано</span>
                                                            ): (
                                                                <span className='p-0 m-0'>{data.community.location}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="row my-1">
                                                        <div className="col">
                                                            Представитель
                                                        </div>
                                                        <div className="col">
                                                            {data.admin_data.username == null || data.admin_data.username == '' ? (
                                                                <span className='p-0 m-0'>Не указан</span>
                                                            ): (
                                                                <span className='p-0 m-0'>{data.admin_data.username}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }   
                                {nav == 'articles' && 
                                    <div className="p-0 m-0">
                                        <div className="card bg-white mb-2">
                                            <div className="card-body">
                                                <Link to={`/community/${id}/createArticle`} className="btn btn-primary w-100">Создать статью</Link>
                                            </div>
                                        </div>
                                        <Card 
                                            title='LAION и энтузиасты по всему миру разрабатывают Open Assistant — открытый аналог ChatGPT' 
                                            who='Company'
                                            description='Некоммерческая организация LAION и энтузиасты по всему миру занимаются разработкой Open Assistant — это проект, цель которого в предоставлении всем желающим доступа к продвинутой большой языковой модели, основанной на принципах чат-бота, с конечной целью революции в инновациях в области обработки естественного языка...'
                                            img_url='https://hsto.org/r/w1560/getpro/habr/upload_files/829/a55/1fa/829a551facb757c2c2c827c243d561a2.png'
                                            articale_id='2'
                                            count_likes="15" 
                                            bookmark_active={true} 
                                        />
                                        <Card 
                                            title='Менеджмент зависимостей в Javascript' 
                                            who='Company'
                                            description='Для многих разработчиков процесс установки зависимостей представляет собой некую "магию", которая происходит при выполнении npm install. Понимание принципов работы этой "магии" может сильно помочь при возникновении ошибки во время установки очередной библиотеки. Нынешний NPM — результат многих лет проб и ошибок, поэтому для его детального понимания я предлагаю начать с самого начала.'
                                            img_url='https://hsto.org/r/w1560/getpro/habr/upload_files/b35/be9/fd4/b35be9fd4106e6e52b741b2f353ff605.png'
                                            articale_id='3'
                                            count_likes="152" 
                                            bookmark_active={true} 
                                        />
                                    </div>
                                }     
                                {nav == 'comments' && 
                                    <div className="p-0 m-0">
                                        <div className="card m-0 p-3 bg-white text-decoration-none text-black mb-2">
                                            <Link to={`/article/1`} className=""><h5 className="card-title mb-1 pb-1">Как использовать промты в ChatGPT для генерации кода на Python</h5></Link>
                                            <div className="card-body ps-0 py-1">
                                                <p className="card-text">
                                                    Комментарий
                                                </p>
                                                
                                            </div>
                                        </div>
                                        <div className="card m-0 p-3 bg-white text-decoration-none text-black mb-2">
                                            <Link to={`/article/1`} className=""><h5 className="card-title mb-1 pb-1">Как использовать промты в ChatGPT для генерации кода на Python</h5></Link>
                                            <div className="card-body ps-0 py-1">
                                                <p className="card-text">
                                                    Комментарий
                                                </p>
                                                
                                            </div>
                                        </div>
                                        <div className="card m-0 p-3 bg-white text-decoration-none text-black mb-2">
                                            <Link to={`/article/1`} className=""><h5 className="card-title mb-1 pb-1">Как использовать промты в ChatGPT для генерации кода на Python</h5></Link>
                                            <div className="card-body ps-0 py-1">
                                                <p className="card-text">
                                                    Комментарий
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                }    
                                {nav == 'news' && 
                                <div className="p-0 m-0">
                                    <div className="card bg-white mb-2">
                                        <div className="card-body">
                                            {createNews == false ? (
                                                <button className='btn btn-primary w-100' onClick={createNewsF} >Создание новости</button>
                                            ):(
                                                <div>
                                                    <h5>Создание нвоостей</h5>
                                                    <h6>Заголовок новости</h6>
                                                    <input type="text" placeholder='Заголовок' className='form-control'/>
                                                    <h6 className='my-2'>Описание новости</h6>
                                                    <input type="text" placeholder='Описание' className='form-control'/>
                                                    <h6 className='my-2'>Публикация</h6>
                                                    <select className="form-select mb-2" aria-label="Default select example">
                                                        <option value="local" selected>Локально</option>
                                                        <option value="global">Глобально</option>
                                                    </select>
                                                    <button className='btn btn-primary w-100'>Опубликовать новость</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="card p-0  bg-white mb-3 text-decoration-none text-black">
                                        <div className="list-group m-0">   
                                            <News id='1' title='News' content='Description news'/>
                                            <News id='2' title='News' content='Description news'/>
                                            <News id='3' title='News' content='Description news'/>
                                        </div>
                                    </div>
                                </div>
                                    
                                }     
                                {nav == 'participants' && 
                                <div className='p-0 m-0'>
                                    <div className='card bg-white mb-2'>
                                        <div className="card-body">
                                            
                                            {createRole==false?(
                                                <button className='btn btn-primary w-100' onClick={createRoleF}>Добавить роль</button>
                                            ):(
                                                <div className='p-0 m-0'>
                                                    <button className='btn btn-primary w-100 mb-3' onClick={createRoleF}>Скрыть создание ролей</button>
                                                    <h5>Существующие роли</h5>
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th className='col'>Роль</th>
                                                                <th className='col'>Администратор</th>
                                                                <th className='col'>Модератор</th>
                                                                <th className='col'>Создание статей</th>
                                                                <th className='col'>Создание новостей</th>
                                                                <th className='col'>Создание рекламы</th>
                                                                <th className='col'>Создание чатов</th>
                                                                <th className='col'>Принимать заявки</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className='fw-bold'>user</td>
                                                                <td>Нет</td>
                                                                <td>Нет</td>
                                                                <td>Да</td>
                                                                <td>Нет</td>
                                                                <td>Нет</td>
                                                                <td>Нет</td>
                                                                <td>Нет</td>
                                                            </tr>
                                                            <tr>
                                                                <td className='fw-bold'>admin</td>
                                                                <td>Да</td>
                                                                <td>Да</td>
                                                                <td>Да</td>
                                                                <td>Да</td>
                                                                <td>Да</td>
                                                                <td>Да</td>
                                                                <td>Да</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <h5 className='mt-3'>Создание роли (Основные параметры)</h5>
                                                    <h6>Название роли:</h6>
                                                    <input type="text" placeholder='name' className='form-control w-100 mb-2'/>
                                                    <h5>Разрешения</h5>
                                                    <h6 title='Может все, от создания постов до удаления сообщества' className='cursor-help'>Администратор (Назначайте с осторожностью) <small>(Наведите чтобы узнать больше)</small></h6>
                                                    <select className="form-select mb-2" aria-label="Default select example">
                                                        <option value="true">Да</option>
                                                        <option value="false" selected>Нет</option>
                                                    </select>
                                                    <h6 title='Имеет права на редактирование постов, новостей, рекламы и т.д.' className='cursor-help'>Модератор (Назначайте с осторожностью) <small>(Наведите чтобы узнать больше)</small></h6>
                                                    <select className="form-select mb-2" aria-label="Default select example">
                                                        <option value="true">Да</option>
                                                        <option value="false" selected>Нет</option>
                                                    </select>
                                                    <h6>Создание статей</h6>
                                                    <select className="form-select mb-2" aria-label="Default select example">
                                                        <option value="true" selected>Да</option>
                                                        <option value="false">Нет</option>
                                                    </select>
                                                    <h6>Создание новостей</h6>
                                                    <select className="form-select mb-2" aria-label="Default select example">
                                                        <option value="true">Да</option>
                                                        <option value="false" selected>Нет</option>
                                                    </select>
                                                    <h6>Создание рекламы</h6>
                                                    <select className="form-select mb-2" aria-label="Default select example">
                                                        <option value="true">Да</option>
                                                        <option value="false" selected>Нет</option>
                                                    </select>
                                                    <h6>Создание чатов</h6>
                                                    <select className="form-select mb-2" aria-label="Default select example">
                                                        <option value="true">Да</option>
                                                        <option value="false" selected>Нет</option>
                                                    </select>
                                                    <h6>Принимать заявки пользователей на вступление в сообщество</h6>
                                                    <select className="form-select mb-2" aria-label="Default select example">
                                                        <option value="true">Да</option>
                                                        <option value="false" selected>Нет</option>
                                                    </select>

                                                    <button className='btn btn-primary w-100' onClick={createRoleF}>Добавить роль</button>
                                                </div>
                                            )}
                                            

                                        </div>
                                    </div>
                                    <div className="card bg-white">
                                        <div className="card-body">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th className='col'>
                                                            Пользователь
                                                        </th>
                                                        <th className='col-2'>
                                                            Роль
                                                        </th>
                                                        <th className='col-2'>
                                                            Рейтинг
                                                        </th>
                                                        <th className='col-2'>
                                                            Действия
                                                        </th>
                                                    </tr>
                                                </thead> 
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <Link to={`/user/1`}>Username</Link>
                                                        </td>
                                                        <td>
                                                            <select className="form-select" aria-label="Default select example">
                                                                <option value="admin">admin</option>
                                                                <option value="user" selected>user</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            122
                                                        </td>
                                                        <td>
                                                            <select className="form-select" aria-label="Default select example">
                                                                <option value="nobody" selected>Ничего</option>
                                                                <option value="ban" className='bg-danger text-white'>Забанить</option>
                                                                <option value="unban" className='bg-success text-white'>Разбанить</option>
                                                            </select>
                                                        </td>
                                                    </tr> 
                                                    <tr>
                                                        <td>
                                                            <Link to={`/user/1`}>Username</Link>
                                                        </td>
                                                        <td>
                                                            <select className="form-select" aria-label="Default select example">
                                                                <option value="admin" selected>admin</option>
                                                                <option value="user">user</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            122
                                                        </td>
                                                        <td>
                                                            <select className="form-select" aria-label="Default select example">
                                                                <option value="admin" selected>Ничего</option>
                                                                <option value="user" className='bg-danger text-white'>Забанить</option>
                                                            </select>
                                                        </td>
                                                    </tr>    
                                                </tbody>   
                                            </table>               
                                        </div>
                                                                 
                                    </div>
                                </div>
                                    
                                    
                                }        
                                {nav == 'chats' && 
                                    <div className="p-0 m-0">
                                        
                                        
                                        <div className="card m-0 p-3 bg-white text-decoration-none text-black mb-2">
                                            <Link to={`/messenger/2`} className=""><h5 className="card-title mb-1 pb-1">Чат болталка</h5></Link>
                                            <div className="card-body ps-0 py-1">
                                                <p className="card-text">
                                                    Описание чата болталки
                                                </p>
                                            </div>
                                        </div>
                                        <div className='card bg-white mb-2'>
                                            <div className="card-body">
                                                <input type="text" placeholder='Заголовок' className='form-control w-100 mb-2' />
                                                <input type="text" placeholder='Описание' className='form-control w-100 mb-2' />
                                                <button className='btn btn-success w-100'>Добавить чат</button>
                                            </div>
                                        </div>
                                    </div>
                                }   
                                {nav == 'settings' && 
                                    <div className='p-0 m-0'>
                                        <div className="card m-0 p-3 bg-white my-3 text-decoration-none text-black">
                                            <div className="card-body ps-0 pt-0 mt-0">
                                                <h5 className="card-title mb-3">Настройки</h5>
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
                                }     
                            </div>
                            <div className='col-3 position-relative p-0 m-0'>
                                <div className='padding-top-20-px position-sticky top-0'>
                                    {nav == 'profile' ? (
                                        <Advertisement landing_page_url='https://habr.com/ru/all/' img_url='https://hsto.org/getpro/habr/widget/4b4/92d/44f/4b492d44fd837fedf2fe66cfdf1b9a57.png'/>
                                    ): null}
                                    {nav == 'articles' ? (
                                        <div>
                                            
                                            <div className="card m-0 p-0 bg-white mb-3 w-100">
                                                <div className="card-body">
                                                        <h6 className='mb-0'>Информация</h6>
                                                        <div className='table pt-1'>
                                                             <div className="row my-1">
                                                                <div className="col">
                                                                    Сайт
                                                                </div>
                                                                <div className="col">
                                                                    {data.community.website == null || data.community.website == '' ? (
                                                                        <span className='p-0 m-0'>Не указан</span>
                                                                    ): (
                                                                        <span className='p-0 m-0'>{data.community.website}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="row my-1">
                                                                <div className="col">
                                                                    Дата регистрации
                                                                </div>
                                                                <div className="col">
                                                                    {data.community.created_at == null || data.community.created_at == '' ? (
                                                                        <span className='p-0 m-0'>Не указан</span>
                                                                    ): (
                                                                        <span className='p-0 m-0'>{data.community.created_at.substring(0,10)}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="row my-1">
                                                                <div className="col">
                                                                    Дата основания
                                                                </div>
                                                                <div className="col">
                                                                    15 октября 1998
                                                                </div>
                                                            </div>
                                                            <div className="row my-1">
                                                                <div className="col">
                                                                    Местоположение
                                                                </div>
                                                                <div className="col">
                                                                    {data.community.location == null || data.community.location == '' ? (
                                                                        <span className='p-0 m-0'>Не указано</span>
                                                                    ): (
                                                                        <span className='p-0 m-0'>{data.community.location}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="row my-1">
                                                                <div className="col">
                                                                    Представитель
                                                                </div>
                                                                <div className="col">
                                                                    {data.admin_data.username == null || data.admin_data.username == '' ? (
                                                                        <span className='p-0 m-0'>Не указан</span>
                                                                    ): (
                                                                        <span className='p-0 m-0'>{data.admin_data.username}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h5 className='mb-3'>Популярные</h5>
                                                        <div className="list-group">
                                                            <Link to={`/article/1`} className="list-group-item list-group-item-action">A second link item</Link>
                                                            <Link to={`/article/2`} className="list-group-item list-group-item-action">A third link item</Link>
                                                            <Link to={`/article/3`} className="list-group-item list-group-item-action">A fourth link item</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                        </div>
                                        
                                    ):null}
                                    {nav == 'comments' ? (
                                        
                                        <div>
                                            <div className="card m-0 p-0 bg-white mb-3 w-100">
                                                <div className="card-body">
                                                    <h6 className='mb-0'>Информация</h6>
                                                    <div className='table pt-1'>
                                                        <div className="row my-1">
                                                            <div className="col">
                                                                Сайт
                                                            </div>
                                                            <div className="col">
                                                                vk.com
                                                            </div>
                                                        </div>
                                                        <div className="row my-1">
                                                            <div className="col">
                                                                Дата регистрации
                                                            </div>
                                                            <div className="col">
                                                                9 августа 2008
                                                            </div>
                                                        </div>
                                                        <div className="row my-1">
                                                            <div className="col">
                                                                Дата основания
                                                            </div>
                                                            <div className="col">
                                                                15 октября 1998
                                                            </div>
                                                        </div>
                                                        <div className="row my-1">
                                                            <div className="col">
                                                                Местоположение
                                                            </div>
                                                            <div className="col">
                                                                Россия
                                                            </div>
                                                        </div>
                                                        <div className="row my-1">
                                                            <div className="col">
                                                                Представитель
                                                            </div>
                                                            <div className="col">
                                                                Анастасия Гутор
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            <Advertisement landing_page_url='https://habr.com/ru/all/' img_url='https://hsto.org/getpro/habr/widget/4b4/92d/44f/4b492d44fd837fedf2fe66cfdf1b9a57.png'/>
                                        </div>
                                    ):null}
                                    {nav == 'news' ? (
                                        <div>
                                            <div className="card m-0 p-0 bg-white mb-3 w-100">
                                                <div className="card-body">
                                                    <h6 className='mb-0'>Информация</h6>
                                                    <div className='table pt-1'>
                                                        <div className="row my-1">
                                                            <div className="col">
                                                                Сайт
                                                            </div>
                                                            <div className="col">
                                                                vk.com
                                                            </div>
                                                        </div>
                                                        <div className="row my-1">
                                                            <div className="col">
                                                                Дата регистрации
                                                            </div>
                                                            <div className="col">
                                                                9 августа 2008
                                                            </div>
                                                        </div>
                                                        <div className="row my-1">
                                                            <div className="col">
                                                                Дата основания
                                                            </div>
                                                            <div className="col">
                                                                15 октября 1998
                                                            </div>
                                                        </div>
                                                        <div className="row my-1">
                                                            <div className="col">
                                                                Местоположение
                                                            </div>
                                                            <div className="col">
                                                                Россия
                                                            </div>
                                                        </div>
                                                        <div className="row my-1">
                                                            <div className="col">
                                                                Представитель
                                                            </div>
                                                            <div className="col">
                                                                Анастасия Гутор
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-body">
                                                    <h5 className='mb-3'>Популярные</h5>
                                                    <div className="list-group">
                                                        <News id='1' title='News' content='Description news'/>
                                                        <News id='2' title='News' content='Description news'/>
                                                        <News id='3' title='News' content='Description news'/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    ):null}
                                    {nav == 'participants' ? (
                                        <div className="card m-0 p-0 bg-white mb-3 w-100">
                                            <div className="card-body">
                                                <h6 className='mb-0'>Информация</h6>
                                                <div className='table pt-1'>
                                                    <div className="row my-1">
                                                        <div className="col">
                                                            Сайт
                                                        </div>
                                                        <div className="col">
                                                            vk.com
                                                        </div>
                                                    </div>
                                                    <div className="row my-1">
                                                        <div className="col">
                                                            Дата регистрации
                                                        </div>
                                                        <div className="col">
                                                            9 августа 2008
                                                        </div>
                                                    </div>
                                                    <div className="row my-1">
                                                        <div className="col">
                                                            Дата основания
                                                        </div>
                                                        <div className="col">
                                                            15 октября 1998
                                                        </div>
                                                    </div>
                                                    <div className="row my-1">
                                                        <div className="col">
                                                            Местоположение
                                                        </div>
                                                        <div className="col">
                                                            Россия
                                                        </div>
                                                    </div>
                                                    <div className="row my-1">
                                                        <div className="col">
                                                            Представитель
                                                        </div>
                                                        <div className="col">
                                                            Анастасия Гутор
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ):null}
                                    {nav == 'settings' ? (
                                        <button className='btn btn-primary me-2' value='settings' onClick={switchNavF}>Настройки</button>
                                    ):null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Community;
