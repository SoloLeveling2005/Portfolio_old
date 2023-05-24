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
import { spawn } from 'child_process';



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

    // Setting inputs

    const [inputTitle, setInputTitle] = useState('');
    const handleChangeTitle = (event:any) => {
        setInputTitle(event.target.value);
    };

    const [inputShortInfo, setInputShortInfo] = useState('');
    const handleChangeShortInfo = (event:any) => {
        setInputShortInfo(event.target.value);
    };

    const [inputDescription, setInputDescription] = useState('');
    const handleChangeDescription = (event:any) => {
        setInputDescription(event.target.value);
    };

    const [inputWebsite, setInputWebsite] = useState('');
    const handleChangeWebsite = (event:any) => {
        setInputWebsite(event.target.value);
    };

    const [inputLocation, setInputLocation] = useState('');
    const handleChangeLocation = (event:any) => {
        setInputLocation(event.target.value);
    };



    // Select inputs

    const [SelectManageParticipants, setSelectManageParticipants] = useState('false');
    const handleChangeSelectManageParticipants = (event:any) => {
        setSelectManageParticipants(event.target.value);
    };

    const [SelectEditCommunityInformation, setSelectEditCommunityInformation] = useState('false');
    const handleChangeSelectEditCommunityInformation = (event:any) => {
        setSelectEditCommunityInformation(event.target.value);
    };

    const [SelectPublishAds, setSelectPublishAds] = useState('false');
    const handleChangeSelectPublishAds = (event:any) => {
        setSelectPublishAds(event.target.value);
    };

    const [SelectPublishArticles, setSelectPublishArticles] = useState('true');
    const handleChangeSelectPublishArticles = (event:any) => {
        setSelectPublishArticles(event.target.value);
    };

    const [SelectPublishNews, setSelectPublishNews] = useState('false');
    const handleChangeSelectPublishNews = (event:any) => {
        setSelectPublishNews(event.target.value);
    };


    // Input название роли

    const [InputRoleName, setInputRoleName] = useState('');
    const handleChangeInputRoleName = (event:any) => {
        setInputRoleName(event.target.value);
    };
    

    // Данные сообщества
    const [admin, create_admin] = useState(null);
    const [signed, create_signed] = useState(null);
    const [edit_community_information, create_edit_community_information] = useState(null);
    const [manage_participants, create_manage_participants] = useState(Boolean||null);
    const [publish_ads, create_publish_ads] = useState(Boolean||null);
    const [publish_articles, create_publish_articles] = useState(null);
    const [publish_news, create_publish_news] = useState(null);
    const [request_to_sign, create_request_to_sign] = useState(null);
    const [subscribers_count, create_subscribers_count] = useState(0);
    const [participant_requests, changeParticipantRequests] = useState([{username:'', id:0}])
    

    const [data, setData] = useState({
        articles: [
            {
                id: 0,
                img: '',
                title: '',
                description: '',
                content: ''
            }
        ],
        articles_comments: [
            {
                article: {
                    id: 0,
                    img: '',
                    title: '',
                    description: '',
                    content: ''
                },
                info: {
                    id: '',
                    content: ''
                }
            }
        ],
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
        roles: [
            {
                id: 0,
                edit_community_information:null,
                manage_participants:null,
                publish_ads:null,
                publish_articles:null,
                publish_news:null,
                title:''
            }
        ],
        admin_data: {
            id: 1,
            username:''
        },
        subscribers: [
            {
                user: {
                    id: 1,
                    username: ''    
                },
                role: {
                    id: 0,
                    title:''
                }
                
            }
        ]
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
            setInputTitle(response.data.community.title == null ? '' : response.data.community.title)
            setInputDescription(response.data.community.description == null ? '' : response.data.community.description)
            setInputShortInfo(response.data.community.short_info == null ? '' : response.data.community.short_info)
            setInputLocation(response.data.community.location == null ? '' : response.data.community.location)
            setInputWebsite(response.data.community.website == null ? '' : response.data.community.website)
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


    let countAboutCommunity = 0
    function aboutCommunity() {
        if (countAboutCommunity == 2) {
            alert('Ошибка поиска')
            countAboutCommunity = 0
            return
        }
        countAboutCommunity += 1

        

        axios.defaults.baseURL = API_BASE_URL
        axios.get(`community/get_about_community/${id}`, { headers: { 'Authorization': "Bearer " + localStorage.getItem('access_token') } })
            .then(response => {
            countAboutCommunity = 0
            console.log(response.data)
            create_admin(response.data.admin)
            create_signed(response.data.signed)
            create_edit_community_information(response.data.edit_community_information)
            create_manage_participants(response.data.manage_participants)
            create_publish_ads(response.data.publish_ads)
            create_publish_articles(response.data.publish_articles)
            create_publish_news(response.data.publish_news)
            create_request_to_sign(response.data.request_to_sign)
            create_subscribers_count(response.data.subscribers_count)
            changeParticipantRequests(response.data.participant_requests)    

        })
        .catch(error => {
            if (error.request.status === 401) {
            axios.post('refresh_token', { 'refresh': localStorage.getItem('refresh_token') })
                .then(response => {
                    localStorage.setItem('access_token', response.data.access)

                    // Запрашиваем данные снова
                    aboutCommunity()
                })
                .catch(error => { console.log(error); navigate('/auth'); });
            }
        });
    }


    let countCreateRole = 0
    function FCreateRole() {
        if (InputRoleName == '') {
            alert('Название роли не определено')
            return
        }

        if (countCreateRole == 3) {
            alert('Ошибка создания')
            countCreateRole = 0
            return
        }
        countCreateRole += 1


        axios.defaults.baseURL = API_BASE_URL
        axios.post(`community/create_community_role`, {
            'community_id':id,
            'title': InputRoleName,
            'edit_community_information':SelectEditCommunityInformation == 'true' ? true : false,
            'manage_participants':SelectManageParticipants == 'true' ? true : false,
            'publish_articles':SelectPublishArticles == 'true' ? true : false,
            'publish_news':SelectPublishNews == 'true' ? true : false,
            'publish_ads':SelectPublishAds == 'true' ? true : false,
        }, { headers: { 'Authorization': "Bearer " + localStorage.getItem('access_token') } })
        .then(response => {
            console.log(response.data)
            alert('Роль успешно создана')
            countCreateRole = 0
            getCommunity()
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

    let countDeleteRole = 0
    function FDeleteRole(role_title: string) {


        if (countDeleteRole == 3) {
            alert('Ошибка создания')
            countDeleteRole = 0
            return
        }
        countDeleteRole += 1


        axios.defaults.baseURL = API_BASE_URL
        axios.delete(`community/delete_community_role/${id}/${role_title}`, { headers: { 'Authorization': "Bearer " + localStorage.getItem('access_token') } })
        .then(response => {
            console.log(response.data)
            alert('Роль успешно удалена')
            countDeleteRole = 0
            getCommunity()
        })
        .catch(error => {
            if (error.request.status === 401) {
                axios.post('refresh_token', { 'refresh': localStorage.getItem('refresh_token') })
                .then(response => {
                    localStorage.setItem('access_token', response.data.access)

                    // Пробуем еще раз 
                    FDeleteRole(role_title)
                })
                .catch(error => { console.log(error); navigate('/auth'); });
            }
        });
    }

    let countAddParticipant = 0
    function addParticipant(roleTitle:string, userId:string) {
        if (countAddParticipant == 3) {
            alert('Ошибка создания')
            countAddParticipant = 0
            return
        }
        countAddParticipant += 1


        axios.defaults.baseURL = API_BASE_URL
        axios.post(`community/add_community_participant`, {
            'participant_id': userId,
            'community_id': id,
            'role_title':roleTitle
        }, { headers: { 'Authorization': "Bearer " + localStorage.getItem('access_token') } })
        .then(response => {
            console.log(response.data)
            alert(`Вы приняли пользователя на роль ${roleTitle}`)
            countAddParticipant = 0
            getCommunity()
            aboutCommunity()
        })
        .catch(error => {
            if (error.request.status === 401) {
                axios.post('refresh_token', { 'refresh': localStorage.getItem('refresh_token') })
                .then(response => {
                    localStorage.setItem('access_token', response.data.access)

                    // Пробуем еще раз 
                    addParticipant(roleTitle, userId)
                })
                .catch(error => { console.log(error); navigate('/auth'); });
            }
        });
    }


    // Update settings



    let countUpdateSettings = 0
    function updateSettings() {
        if (countUpdateSettings == 3) {
            alert('Ошибка обновления')
            countUpdateSettings = 0
            return
        }
        countUpdateSettings += 1


        axios.defaults.baseURL = API_BASE_URL
        axios.put(`community/update_community`, {
            community_id: id,
            title: inputTitle,
            short_info: inputShortInfo,
            description: inputDescription,
            website: inputWebsite,
            location: inputLocation,
        }, { headers: { 'Authorization': "Bearer " + localStorage.getItem('access_token') } })
            .then(response => {
                console.log(response.data)
                alert("Информация обновлена")
                countUpdateSettings = 0

            })
            .catch(error => {
                if (error.request.status === 401) {
                    axios.post('refresh_token', { 'refresh': localStorage.getItem('refresh_token') })
                    .then(response => {
                        localStorage.setItem('access_token', response.data.access)

                        // Пробуем еще раз
                        updateSettings()
                    })
                    .catch(error => {
                        console.log(error); navigate('/auth');
                    });
                }
            });
    }


    
    useEffect(() => {
        getCommunity()
        aboutCommunity()
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
                                            {/* {nav == 'chats' ? (
                                                <button className='btn btn-primary me-1 px-2' value='chats' onClick={switchNavF}>Чаты</button>
                                            ):(
                                                <button className='btn me-1 px-2' value='chats' onClick={switchNavF}>Чаты</button>
                                            )} */}
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
                                        {publish_articles == true &&
                                            <div className="card bg-white mb-2">
                                                <div className="card-body">
                                                    <Link to={`/community/${id}/createArticle`} className="btn btn-primary w-100">Создать статью</Link>
                                                </div>
                                            </div>
                                        }
                                        {data.articles.map((item, index) => (
                                            <Card 
                                                key={index}
                                                title={item.title}
                                                who={data.community.title}
                                                communityId={data.community.id.toString()}
                                                description={item.description}
                                                img_url={API_BASE_URL+item.img}
                                                article_id={item.id.toString()}
                                                count_likes="15" 
                                                bookmark_active={true} 
                                            />
                                        ))}
                                        
                                    </div>
                                }     
                                {nav == 'comments' && 
                                    <div className="p-0 m-0">
                                        {data.articles_comments.map((item, index) => (
                                            <div className="card m-0 p-3 bg-white text-decoration-none text-black mb-2">
                                                <Link to={`/article/${item.article.id}`} className=""><h5 className="card-title mb-1 pb-1">{item.article.title}</h5></Link>
                                                <div className="card-body ps-0 py-1">
                                                    <p className="card-text">
                                                        {item.info.content}
                                                    </p>         
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                }    
                                {nav == 'news' && 
                                <div className="p-0 m-0">
                                    <div className="card bg-white mb-2">
                                        <div className="card-body">
                                            {!createNews ? (
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
                                    {manage_participants &&
                                        <div className='card bg-white mb-2'>
                                            <div className="card-body">
                                                
                                                
                                                {!createRole ? (
                                                
                                                    <button className='btn btn-primary w-100' onClick={createRoleF}>Добавить роль</button>
                                                ):(
                                                    <div className='p-0 m-0'>
                                                        <button className='btn btn-primary w-100 mb-3' onClick={createRoleF}>Скрыть создание ролей</button>
                                                        <h5>Существующие роли</h5>
                                                        <table className="table">
                                                            <thead>
                                                                <tr>
                                                                    <th className='col'>Роль</th>
                                                                    <th className='col'>Модератор</th>
                                                                    <th className='col'>Управляющий</th>
                                                                    <th className='col'>Создание статей</th>
                                                                    <th className='col'>Создание новостей</th>
                                                                    <th className='col'>Создание рекламы</th>
                                                                    <th className='col'>Действие</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td className='fw-bold'>admin</td>
                                                                    <td>Да</td>
                                                                    <td>Да</td>
                                                                    <td>Да</td>
                                                                    <td>Да</td>
                                                                    <td>Да</td>
                                                                    <td>Нет</td>
                                                                </tr>
                                                                {data.roles.map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td className='fw-bold'>{ item.title }</td>
                                                                        <td>{ item.manage_participants == true ? (<span>Да</span>):(<span>Нет</span>) }</td>
                                                                        <td>{ item.edit_community_information == true ? (<span>Да</span>):(<span>Нет</span>) }</td>
                                                                        <td>{ item.publish_articles == true ? (<span>Да</span>):(<span>Нет</span>) }</td>
                                                                        <td>{ item.publish_news == true ? (<span>Да</span>):(<span>Нет</span>) }</td>
                                                                        <td>{ item.publish_ads == true ? (<span>Да</span>):(<span>Нет</span>) }</td>
                                                                        <td><button className='btn btn-warning text-white' onClick={()=>{FDeleteRole(item.title.toString())}}>Удалить</button></td>
                                                                    </tr>  
                                                                ))}        
                                                            </tbody>
                                                        </table>
                                                        <h5 className='mt-3'>Создание роли (Основные параметры)</h5>
                                                        <h6>Название роли:</h6>
                                                        <input type="text" placeholder='name' className='form-control w-100 mb-2' value={InputRoleName} onChange={handleChangeInputRoleName}/>
                                                        <h5>Разрешения</h5>
                                                        <h6 title='Может редактировать информацию о сообществе (название, роли, описание и т.д.)' className='cursor-help'>Модератор <small>(Наведите чтобы узнать больше)</small></h6>
                                                        <select className="form-select mb-2" aria-label="Default select example" value={SelectManageParticipants} onChange={handleChangeSelectManageParticipants}>
                                                            <option value="true">Да</option>
                                                            <option value="false" selected>Нет</option>
                                                        </select>
                                                        <h6 title='Может управление пользователями (добавление, удаление, бан и т.д.).' className='cursor-help'>Управляющий <small>(Наведите чтобы узнать больше)</small></h6>
                                                        <select className="form-select mb-2" aria-label="Default select example" value={SelectEditCommunityInformation} onChange={handleChangeSelectEditCommunityInformation}>
                                                            <option value="true">Да</option>
                                                            <option value="false" selected>Нет</option>
                                                        </select>
                                                        <h6>Создание статей</h6>
                                                        <select className="form-select mb-2" aria-label="Default select example" value={SelectPublishArticles} onChange={handleChangeSelectPublishArticles}>
                                                            <option value="true" selected>Да</option>
                                                            <option value="false">Нет</option>
                                                        </select>
                                                        <h6>Создание новостей</h6>
                                                        <select className="form-select mb-2" aria-label="Default select example" value={SelectPublishNews} onChange={handleChangeSelectPublishNews}>
                                                            <option value="true">Да</option>
                                                            <option value="false" selected>Нет</option>
                                                        </select>
                                                        <h6>Создание рекламы</h6>
                                                        <select className="form-select mb-2" aria-label="Default select example" value={SelectPublishAds} onChange={handleChangeSelectPublishAds}>
                                                            <option value="true">Да</option>
                                                            <option value="false" selected>Нет</option>
                                                        </select>
                                                        <button className='btn btn-primary w-100' onClick={FCreateRole}>Добавить роль</button>
                                                        
                                                    </div>
                                                    
                                                
                                                )}
                                                
                                                

                                            </div>
                                        </div>
                                    }  
                                    {participant_requests.length != 0 &&
                                        <div className="card bg-white mb-2">
                                            <div className="card-body">
                                                <h5>Заявки</h5>    
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th className='col'>
                                                                Пользователь
                                                            </th>
                                                            <th className='col-2'>
                                                                Роль
                                                            </th>
                                                        </tr>
                                                    </thead> 
                                                    <tbody>
                                                        {participant_requests.map((item, index) => (
                                                            <tr>
                                                                <td>
                                                                    <Link to={`/user/${item.id}`}>{ item.username }</Link>
                                                                </td>
                                                                <td>
                                                                    <select className="form-select" aria-label="Default select example" onChange={(event) => addParticipant(event.target.value, item.id.toString())}>
                                                                        <option value="none"selected>нет</option>
                                                                        {data.roles.map((itemRole, indexRole) => (
                                                                            <option value={itemRole.title} >{itemRole.title}</option>
                                                                        ))}
                                                                    </select>   
                                                                </td>
                                                            </tr> 
                                                        ))}    
                                                        
                                                        {data.subscribers.map((item, index) => (
                                                            <tr>
                                                                <td>
                                                                    <Link to={`/user/${item.user.id}`}>{ item.user.username }</Link>
                                                                </td>
                                                                <td>
                                                                    {manage_participants == true ? (
                                                                        <select className="form-select" aria-label="Default select example">
                                                                            <option value="admin">admin</option>
                                                                            <option value="user" selected>user</option>
                                                                        </select>
                                                                    ): (
                                                                        <p>Роль</p>      
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {manage_participants == true &&
                                                                        <select className="form-select" aria-label="Default select example">
                                                                            <option value="nobody" selected>Ничего</option>
                                                                            <option value="ban" className='bg-danger text-white'>Забанить</option>
                                                                            <option value="unban" className='bg-success text-white'>Разбанить</option>
                                                                        </select>
                                                                    }
                                                                </td>
                                                            </tr> 
                                                        ))}
                                                        
                                                        
                                                    </tbody>   
                                                </table>               
                                            </div>
                                                                    
                                        </div>
                                    }
                                    
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
                                                        {manage_participants == true &&
                                                            <th className='col-2'>
                                                                Действия
                                                            </th>
                                                        }
                                                    </tr>
                                                </thead> 
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <Link to={`/user/${data.admin_data.id}`}>{ data.admin_data.username }</Link>
                                                        </td>
                                                        <td>
                                                            <p>Админ</p>
                                                        </td>
                                                        {manage_participants == true &&
                                                            <td>
                                                                Нет действий
                                                            </td>
                                                        }
                                                    </tr> 
                                                    {data.subscribers.map((item, index) => (
                                                        <tr>
                                                            <td>
                                                                <Link to={`/user/${item.user.id}`}>{ item.user.username }</Link>
                                                            </td>
                                                            <td>
                                                                { manage_participants == true ? (
                                                                    <select className="form-select" aria-label="Default select example">
                                                                        {data.roles.map((itemRole, indexRole) => (
                                                                            
                                                                                <option value={itemRole.title} >{itemRole.title}</option>
                                                                             
                                                                        ))}
                                                                    </select> 
                                                                ) : (
                                                                    <span>{item.role.title}</span>
                                                                )}
                                                                
                                                            </td>
                                                            <td>
                                                                {manage_participants == true &&
                                                                    <select className="form-select" aria-label="Default select example">
                                                                        <option value="nobody" selected>Ничего</option>
                                                                        <option value="ban" className='bg-danger text-white'>Забанить</option>
                                                                        <option value="unban" className='bg-success text-white'>Разбанить</option>
                                                                    </select>
                                                                }
                                                            </td>
                                                        </tr> 
                                                    ))}
                                                    
                                                     
                                                </tbody>   
                                            </table>               
                                        </div>
                                                                 
                                    </div>
                                </div>
                                    
                                    
                                }        
                                {/* {nav == 'chats' && 
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
                                }    */}
                                {nav == 'settings' && 
                                    <div className='p-0 m-0'>
                                        <div className="card m-0 p-3 bg-white my-3 text-decoration-none text-black">
                                            <div className="card-body ps-0 pt-0 mt-0">
                                                <h5 className="card-title mb-3">Настройки</h5>
                                                <form>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleInputPassword1" className="form-label ">Название</label>
                                                        <input type="text" className="form-control" id="exampleInputPassword1" value={inputTitle} onChange={handleChangeTitle}></input>
                                                        <div id="emailHelp" className="form-text">Наименование сообщества.</div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleInputPassword1" className="form-label ">Небольшое описание</label>
                                                        <input type="text" className="form-control" id="exampleInputPassword1" value={inputShortInfo} onChange={handleChangeShortInfo}></input>
                                                        <div id="emailHelp" className="form-text">Дайте небольшое описание, в чем суть сообщества.</div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="floatingTextarea2">Описание</label>
                                                        <textarea className="form-control textarea-height-200 mt-2" placeholder="" id="floatingTextarea2" value={inputDescription} onChange={handleChangeDescription}></textarea>
                                                        <div id="emailHelp" className="form-text">Остальная информация</div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleInputPassword1" className="form-label ">Сайт</label>
                                                        <input type="text" className="form-control" id="exampleInputPassword1" value={inputWebsite} onChange={handleChangeWebsite}></input>
                                                        <div id="emailHelp" className="form-text">Если у вас имеется сайт укажите его выше.</div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleInputPassword1" className="form-label ">Расположение</label>
                                                        <input type="text" className="form-control" id="exampleInputPassword1" value={inputLocation} onChange={handleChangeLocation}></input>
                                                        <div id="emailHelp" className="form-text">Введите ваш центр. Например, место где расположена ваши организаторы и т.д.</div>
                                                    </div>
                                                    {/*<div className="mb-3">*/}
                                                    {/*    <label htmlFor="exampleInputPassword1" className="form-label ">Категории</label>*/}
                                                    {/*    <div className='d-flex'>*/}
                                                    {/*        <select className="form-select mb-2 me-2" aria-label="Default select example">*/}
                                                    {/*            <option selected>Не выбрано</option>*/}
                                                    {/*            <option value="1">Разработка</option>*/}
                                                    {/*            <option value="2">Дизайн</option>*/}
                                                    {/*            <option value="3">Инженерия</option>*/}
                                                    {/*            <option value="3">Строительство</option>*/}
                                                    {/*            <option value="3">Моделирование</option>*/}
                                                    {/*            <option value="3">3Д дизайн</option>*/}
                                                    {/*        </select>*/}
                                                    {/*        <select className="form-select mb-2 me-2" aria-label="Default select example">*/}
                                                    {/*            <option selected>Не выбрано</option>*/}
                                                    {/*            <option value="1">Разработка</option>*/}
                                                    {/*            <option value="2">Дизайн</option>*/}
                                                    {/*            <option value="3">Инженерия</option>*/}
                                                    {/*            <option value="3">Строительство</option>*/}
                                                    {/*            <option value="3">Моделирование</option>*/}
                                                    {/*            <option value="3">3Д дизайн</option>*/}
                                                    {/*        </select>*/}
                                                    {/*        <select className="form-select mb-2" aria-label="Default select example">*/}
                                                    {/*            <option selected>Не выбрано</option>*/}
                                                    {/*            <option value="1">Разработка</option>*/}
                                                    {/*            <option value="2">Дизайн</option>*/}
                                                    {/*            <option value="3">Инженерия</option>*/}
                                                    {/*            <option value="3">Строительство</option>*/}
                                                    {/*            <option value="3">Моделирование</option>*/}
                                                    {/*            <option value="3">3Д дизайн</option>*/}
                                                    {/*        </select>*/}
                                                    {/*    </div>*/}
                                                    {/*    <div id="emailHelp" className="form-text">Выберите под какие категории попадает сообщество.</div>*/}
                                                    {/*</div>*/}

                                                    <button type="button" className="btn btn-success mt-3" onClick={updateSettings}>Обновить</button>
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
