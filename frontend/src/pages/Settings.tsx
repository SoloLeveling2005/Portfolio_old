import React, { useEffect, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import Smart_search from '../components/SmartSearch';
import { Link, useNavigate } from 'react-router-dom';
import UserInfo from '../components/UserInfo';
import ActivityUser from '../components/ActivityUser';
import axios from 'axios';
import { profile } from 'console';

function Settings() {
    const navigate = useNavigate();

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
            gender: '',
            last_login: '',
            registered: '',
            short_info:''
        },
        user: {},
        userAvatarUrl: ''
    });

    const handleChangeData = (data:any) => {
        setData(data);
    };

    // Реактивный select Location
    // const [selectedLocation, setSelectedLocation] = useState('');

    // const handleSelectChangeLocation = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const value = event.target.value;
    //     setSelectedLocation(value);
    // };

    // // Реактивный select Day
    // const [selectedDay, setSelectedDay] = useState('');

    // const handleSelectChangeDay = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const value = event.target.value;
    //     setSelectedDay(value);
    // };

    // // Реактивный select Mounth
    // const [selectedMounth, setSelectedMounth] = useState('');

    // const handleSelectChangeMounth = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const value = event.target.value;
    //     setSelectedMounth(value);
    // };

    // // Реактивный select Year
    // const [selectedYear, setSelectedYear] = useState('');

    // const handleSelectChangeYear = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const value = event.target.value;
    //     setSelectedYear(value);
    // };

    // navbar
    
    // Реактивный select Gender
    

    // Profile inputs

    const [inputShortInfo, setInputShortInfo] = useState('');

    const handleChangeShortInfo = (event:any) => {
        setInputShortInfo(event.target.value);
    };

    const [inputLocation, setInputLocation] = useState('');

    const handleChangeLocation = (event:any) => {
        setInputLocation(event.target.value);
    };

    const [inputBirthday, setInputBirthday] = useState('');

    const handleChangeBirthday = (event:any) => {
        setInputBirthday(event.target.value);
    };

    const [selectedGender, setSelectedGender] = useState('');

    const handleSelectChangeselectedGender = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        console.log(value)
        setSelectedGender(value);
    };

    
    const [nav, switchNav] = useState('profile');
    function switchNavF (event:any) {
        const { value } = event.target;
        switchNav(sw => (value))
    }

    function get_user_data() {
        // Получаем информацию о пользователе
        axios.defaults.baseURL = "http://127.0.0.1:8000"
        axios.get(`api/users/get_user/${localStorage.getItem('user_id')}`, { headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')}})
        .then(response => {
            console.log(response.data)
            handleChangeData(response.data)
            
            setInputShortInfo(response.data.profile.short_info)
            setInputLocation(response.data.profile.location)
            setInputBirthday(response.data.profile.birthday)
            setSelectedGender(response.data.profile.gender == true ? 'true' : 'false')
            setTimeout(()=>{console.log(data)}, 1000)
        })
        .catch(error => {
            if (error.request.status === 401) {
                // Если сервер ответил что пользователь не авторизован, отправляем запрос на перезапуск access токена. Если это не помогает то выводим ошибку.
                axios.post('api/refresh_token', {
                    'refresh': localStorage.getItem('refresh_token'),
                })
                .then(response => {
                    // 
                    localStorage.setItem('access_token', response.data.access)

                    // Запрашиваем данные снова
                    axios.get(`api/users/get_user/${localStorage.getItem('user_id')}`, { headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')}})
                    .then(response => {
                        console.log(response.data)
                        handleChangeData(response.data)
                        setInputShortInfo(response.data.profile.short_info)
                        setInputLocation(response.data.profile.location)
                        setInputBirthday(response.data.profile.birthday)
                        setSelectedGender(response.data.profile.gender == true ? 'true' : 'false')
                    })
                    .catch(error => {
                        if (error.response.status === 401) {
                            navigate('/auth');
                        }
                    });
                })
                .catch(error => {
                    console.log(error)
                });
            }
        });
    }


    // Вызываем один раз.
    useEffect(() => {
        get_user_data()
    }, []);

    // Обновление данных профиля
    let countUpdateProfile = 0;
    function updateProfile() {
        // Если перезапуск был слишком часто
        if (countUpdateProfile == 2) {
            alert("Ошибка отправки данных")
            countUpdateProfile = 0
            return
        }
        // Обновляем счетчик 
        countUpdateProfile += 1

        // Проверяем на существование данных
        if (inputShortInfo == '' || inputLocation == '' || selectedGender == '' || inputBirthday == '') {
            alert("Заполните все поля")
            countUpdateProfile =  0
            return
        }

        axios.defaults.baseURL = 'http://127.0.0.1:8000/api'
        axios.patch('users/update_user_profile', {
            "short_info": inputShortInfo,
            "location": inputLocation,
            'gender': selectedGender == 'true' ? true : false,
            'birthday': inputBirthday
        },{ headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')} }).then(response => {

            countUpdateProfile = 0
            alert('Данные успешно обновлены')
            get_user_data();
        })
        .catch(error => {
            console.log(error)
            if (error.request.status === 401) {
                // Если сервер ответил что пользователь не авторизован, отправляем запрос на перезапуск access токена. Если это не помогает то выводим ошибку.
                axios.post('api/refresh_token', {
                    'refresh': localStorage.getItem('refresh_token'),
                })
                .then(response => {
                    // 
                    localStorage.setItem('access_token', response.data.access)

                    // Запрашиваем данные снова
                    updateProfile()
                })
                .catch(error => {
                    console.log(error)
                });
            }
            
        });
    }

    // Обновление автарки пользователя
    let countUpdateUserAvatar = 0;
    function updateUserAvatar() {
        // Если перезапуск был слишком часто
        if (countUpdateUserAvatar == 2) {
            alert("Ошибка отправки данных")
            countUpdateUserAvatar = 0
            return
        }
        // Обновляем счетчик 
        countUpdateUserAvatar += 1

        // Получение аватарки
        const inputElement = document.getElementById('file-input');
        // @ts-ignore
        const file = inputElement.files[0];

        // Проверяем на существование данных
        if (!file) {
            alert("Картинка не вставлена")
            countUpdateUserAvatar =  0
            return
        }

        // Формируем заголовок запроса
        const body = {
            avatar:file
        }

        axios.defaults.baseURL = 'http://127.0.0.1:8000/api'
        axios.patch('users/update_user_avatar', body, { headers:{'Authorization':"Bearer "+localStorage.getItem('access_token'),'Content-Type': 'multipart/form-data',} }).then(response => {

            countUpdateUserAvatar = 0
            alert('Данные успешно обновлены')
            updateUserAvatar();
        })
        .catch(error => {
            console.log(error)
            if (error.request.status === 401) {
                // Если сервер ответил что пользователь не авторизован, отправляем запрос на перезапуск access токена. Если это не помогает то выводим ошибку.
                axios.post('api/refresh_token', {
                    'refresh': localStorage.getItem('refresh_token'),
                })
                .then(response => {
                    // 
                    localStorage.setItem('access_token', response.data.access)

                    // Запрашиваем данные снова
                    updateUserAvatar()
                })
                .catch(error => {
                    navigate('/auth')
                });
            }
            
        });
    }

    let countSignOut = 0
    function SignOut() {
        // Если перезапуск был слишком часто
        if (countSignOut == 2) {
            alert("Ошибка отправки запроса")
            countSignOut = 0
            return
        }
        // Обновляем счетчик 
        countSignOut += 1

        axios.defaults.baseURL = 'http://127.0.0.1:8000/api'
        axios.post('signout', {'refresh_token':localStorage.getItem('refresh_token')},{ headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')} }).then(response => {
            countSignOut = 0
            navigate('/auth');
            return
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
                    SignOut()
                })
                .catch(error => {
                    console.log(error)
                });
            }
        });
    }



    return (
        <div className="Home ">
            <div className=''>
                <Header page='Settings'/>
            </div>
            <div className="w-100 h-100 pb-3">
                <div className='container my-3'>
                    <div className="card m-0 p-0 bg-white">
                        <div className="card-body">
                            <h5 className="card-title">Настройки</h5>
                            <ul className="nav nav-pills pt-3" id="pills-tab" role="tablist">
                                {nav === 'profile' ? (
                                    <button className="nav-link active me-2" value="profile" onClick={switchNavF} type="button">Профиль</button>
                                ):(
                                    <button className="nav-link me-2" value="profile" onClick={switchNavF} type="button">Профиль</button>
                                )}
                                {/* {nav === 'specialization' ? (
                                    <button className="nav-link active me-2" value="specialization" onClick={switchNavF} type="button">Специализация</button>
                                ):(
                                    <button className="nav-link me-2" value="specialization" onClick={switchNavF} type="button">Специализация</button>
                                )} */}
                                {/* {nav === 'account' ? (
                                    <button className="nav-link active me-2" value="account" onClick={switchNavF} type="button">Аккаунт</button>
                                ):(
                                    <button className="nav-link me-2" value="account" onClick={switchNavF} type="button">Аккаунт</button>
                                )} */}
                                {nav === 'privacy' ? (
                                    <button className="nav-link active me-2" value="privacy" onClick={switchNavF} type="button">Приватность</button>
                                ):(
                                    <button className="nav-link me-2" value="privacy" onClick={switchNavF} type="button">Приватность</button>
                                )}
                                {nav === 'notifications' ? (
                                    <button className="nav-link active me-2" value="notifications" onClick={switchNavF} type="button">Уведомления</button>
                                ):(
                                    <button className="nav-link" value="notifications" onClick={switchNavF} type="button">Уведомления</button>
                                )}
                            </ul>
                        </div>
                    </div>
                    {nav === 'profile' &&
                        <section>
                            <div className="card m-0 p-3 bg-white my-3 text-decoration-none text-black">
                                <div className="card-body ps-0 pt-0 mt-0">
                                    <h5 className="card-title mb-3" >Основной</h5>
                                    <div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label ">Немного о вас</label>
                                            <input autoComplete='off' type="text" className="form-control" id="exampleInputPassword1" value={inputShortInfo} onChange={handleChangeShortInfo}></input>
                                            <div id="emailHelp" className="form-text">Напишите небольшое описание себя.</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label ">Страна проживания</label>
                                            <input autoComplete='off' type="text" className="form-control" id="exampleInputPassword1" value={inputLocation} onChange={handleChangeLocation}></input>
                                            <div id="emailHelp" className="form-text">Напишите где вы в данный момент живете (Казахстан, Россия, США, Китай).</div>
                                        </div>
                                        {/* <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label">Страна проживания</label>
                                            <select className="form-select" aria-label="Default select example" id="exampleInputPassword1" value={selectedLocation} onChange={handleSelectChangeLocation}>
                                                <option selected>Не указан</option>
                                                <option value="1">Казахстан</option>
                                                <option value="2">Россия</option>
                                                <option value="3">США</option>
                                                <option value="4">Китай</option>
                                            </select>
                                        </div> */}
                                        
                                        <div className="mb-3">
                                            <div className="table">
                                                <div className="row">
                                                    <div className="col">
                                                        <label htmlFor="exampleInputPassword1" className="form-label mb-0">Пол</label>
                                                        <select className="form-select" aria-label="Default select example" id="exampleInputPassword1" value={selectedGender} onChange={handleSelectChangeselectedGender}>
                                                            <option value="">Не указан</option>
                                                            <option value="true">Мужской</option>
                                                            <option value="false">Женский</option>
                                                        </select>
                                                    </div>
                                                    {/* <div className="col d-flex flex-column justify-content-end">
                                                        <label htmlFor="exampleInputPassword1" className="form-label mb-0">Дата рождения</label>
                                                        <select className="form-select" aria-label="Default select example" id="exampleInputPassword1">
                                                            <option selected>Число</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>
                                                            <option value="6">6</option>
                                                            <option value="7">7</option>
                                                            <option value="8">8</option>
                                                            <option value="9">9</option>
                                                            <option value="10">10</option>
                                                            <option value="11">11</option>
                                                            <option value="12">12</option>
                                                            <option value="13">13</option>
                                                            <option value="14">14</option>
                                                            <option value="15">15</option>
                                                            <option value="16">16</option>
                                                            <option value="17">17</option>
                                                            <option value="18">18</option>
                                                            <option value="19">19</option>
                                                            <option value="20">20</option>
                                                            <option value="21">21</option>
                                                            <option value="22">22</option>
                                                            <option value="23">23</option>
                                                            <option value="24">24</option>
                                                            <option value="25">25</option>
                                                            <option value="26">26</option>
                                                            <option value="27">27</option>
                                                            <option value="28">28</option>
                                                            <option value="29">29</option>
                                                            <option value="30">30</option>
                                                            <option value="31">31</option>
                                                        </select>
                                                    </div>
                                                    <div className="col d-flex flex-column justify-content-end">
                                                        <select className="form-select" aria-label="Default select example" id="exampleInputPassword1">
                                                            <option selected>Месяц</option>
                                                            <option value="01">01</option>
                                                            <option value="02">02</option>
                                                            <option value="03">03</option>
                                                            <option value="04">04</option>
                                                            <option value="05">05</option>
                                                            <option value="06">06</option>
                                                            <option value="07">07</option>
                                                            <option value="08">08</option>
                                                            <option value="09">09</option>
                                                            <option value="10">10</option>
                                                            <option value="11">11</option>
                                                            <option value="12">12</option>
                                                        </select>
                                                    </div>
                                                    <div className="col d-flex flex-column justify-content-end">
                                                        <select className="form-select" aria-label="Default select example" id="exampleInputPassword1">
                                                            <option selected>Год</option>
                                                            <option value="2023">2023</option>
                                                            <option value="2022">2022</option>
                                                            <option value="2021">2021</option>
                                                            <option value="2020">2020</option>
                                                            <option value="2019">2019</option>
                                                            <option value="2018">2018</option>
                                                            <option value="2017">2017</option>
                                                            <option value="2016">2016</option>
                                                            <option value="2015">2015</option>
                                                            <option value="2014">2014</option>
                                                            <option value="2013">2013</option>
                                                            <option value="2012">2012</option>
                                                            <option value="2011">2011</option>
                                                            <option value="2010">2010</option>
                                                            <option value="2009">2009</option>
                                                            <option value="2008">2008</option>
                                                            <option value="2007">2007</option>
                                                            <option value="2006">2006</option>
                                                            <option value="2005">2005</option>
                                                            <option value="2004">2004</option>
                                                            <option value="2003">2003</option>
                                                            <option value="2002">2002</option>
                                                            <option value="2001">2001</option>
                                                            <option value="2000">2000</option>
                                                            <option value="1999">1999</option>
                                                            <option value="1998">1998</option>
                                                        </select>
                                                    </div> */}
                                                    <div className="col">
                                                        <label htmlFor="exampleInputPassword1" className="form-label m-0">Дата рождения</label>
                                                        <input autoComplete='off' type="text" className="form-control" id="exampleInputPassword1" placeholder='Формат: 2023-05-20 (год месяц день)' value={inputBirthday} onChange={handleChangeBirthday}></input>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>

                                        <button type="button" className="btn btn-success mt-3" onClick={updateProfile}>Сохранить</button>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="card m-0 p-3 pb-2 bg-white my-3 text-decoration-none text-black">
                                <div className="card-body ps-0 pt-0 mt-0">
                                    <div className="mb-1 mt-2">
                                        <label htmlFor="file-input" className="form-label">Выберите аватарку</label>
                                        <input autoComplete='off' className="form-control btn" type="file" accept="image/*" id="file-input" readOnly></input>
                                    </div>
                                    
                                    <button type="button" className="btn btn-success mt-3" onClick={updateUserAvatar}>Сохранить</button>
                                </div>
                            </div>
                            <div className="card m-0 p-3 bg-white my-3 text-decoration-none text-black">
                                <div className="card-body ps-0 pt-0 mt-0">
                                    <h5 className="card-title mb-3">Дополнительная информация (пока не будет реализована)</h5>
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label ">Сайт</label>
                                            <input autoComplete='off' type="text" className="form-control" id="exampleInputPassword1"></input>
                                            <div id="emailHelp" className="form-text">Ссылка на сайт.</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label ">Телеграмм</label>
                                            <input autoComplete='off' type="text" className="form-control mb-1" id="exampleInputPassword1" placeholder='Ваша ссылка на профиль (можно получить в настройках телеграмм профиля).'></input>
                                            <input autoComplete='off' type="text" className="form-control" id="exampleInputPassword1" placeholder='Ваш id. (необязательно, дает возможность получать уведомления в телеграмм бот)'></input>
                                            <div id="emailHelp" className="form-text">Получить id профиля телеграмм можно через нашего бота <a href="https://t.me/HubAnywhereBot" target="_blank">HubAnywhereBot</a>.</div>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <label htmlFor="floatingTextarea2">Описание</label>
                                            <textarea className="form-control textarea-height-200 mt-2" placeholder="" id="floatingTextarea2"></textarea>
                                            <div id="emailHelp" className="form-text">Остальная информация</div>
                                        </div>
                                        
                                        
                                    
                                        <button type="button" className="btn btn-success mt-3">Сохранить</button>
                                    </form>
                                    
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <h5>
                                        Опасная зона
                                    </h5>
                                    <button className='btn btn-danger' onClick={SignOut}>Выйти с аккаунта</button>
                                </div>
                            </div>
                        </section>
                    }

                    {nav === 'specialization' &&
                        <section>
                            <div className="card m-0 p-3 bg-white my-3 text-decoration-none text-black">
                                <div className="card-body ps-0 pt-0 mt-0">
                                    <form>
                                        <h5 className="card-title mb-3" >Специализация</h5>
                                        <h6>Выберите вашу специализацию.</h6>
                                    
                                        <select className="form-select mb-2" aria-label="Default select example">
                                            <option selected>Разработка</option>
                                            <option value="1">Десктоп разработка</option>
                                            <option value="2">Бэкенд разработчик</option>
                                            <option value="3">Фронтенд разработчик</option>
                                        </select>
                                        <select className="form-select mb-2" aria-label="Default select example">
                                            <option selected>Тестирование</option>
                                            <option value="1">Инженер по автоматизации тестирования</option>
                                            <option value="2">Инженер по производительности</option>
                                            <option value="3">Инженер по ручному тестированию</option>
                                        </select>
                                        <select className="form-select mb-2" aria-label="Default select example">
                                            <option selected>Администрирование</option>
                                            <option value="1">Системный администратор</option>
                                            <option value="2">Администратор серверов</option>
                                            <option value="3">Администратор баз данных</option>
                                        </select>
                                        <select className="form-select mb-2" aria-label="Default select example">
                                            <option selected>Дизайн</option>
                                            <option value="1">UI/UX дизайнер</option>
                                            <option value="2">Веб дизайнер</option>
                                            <option value="3">Дизайнер приложений</option>
                                        </select>
                                        <select className="form-select mb-2" aria-label="Default select example">
                                            <option selected>Менеджмент</option>
                                            <option value="1">Менеджер проекта</option>
                                            <option value="2">Директор проекта</option>
                                            <option value="3">Менеджер продукта</option>
                                        </select>
                                        <select className="form-select mb-2" aria-label="Default select example">
                                            <option selected>Аналитика</option>
                                            <option value="1">Системный аналитик</option>
                                            <option value="2">Бизнес-аналитик</option>
                                            <option value="3">Аналитик по данным</option>
                                        </select>
                                        


                                        <h6 className='mt-3'>Квалификация.</h6>
                                        <select className="form-select mb-2" aria-label="Default select example">
                                            <option selected>Не указана</option>
                                            <option value="1">Стажер</option>
                                            <option value="2">Младший</option>
                                            <option value="3">Средний</option>
                                            <option value="3">Ведущий</option>
                                        </select>

                                        {/* <h6 className="card-title mb-3" >Профессиональные навыки</h6> */}
                                        <h6 className='mt-3'>Выберите свои профессиональные навыки.</h6>
                                        <div className="form-control py-2 d-flex flex-wrap" placeholder='Навыки'>
                                            <button type="button" className="btn btn-outline-info disabled me-2 my-1 px-3">Info</button>    
 
                                        </div>
                                        <div className='d-flex mt-2 flex-wrap'>
                                            <button type="button" className="btn btn-outline-primary m-1">Git</button>
                                            <button type="button" className="btn btn-outline-primary m-1">JavaScript</button>
                                            <button type="button" className="btn btn-outline-primary m-1">HTML</button>
                                            <button type="button" className="btn btn-outline-primary m-1">SQL</button>
                                            <button type="button" className="btn btn-outline-primary m-1">CSS</button>
                                            <button type="button" className="btn btn-outline-primary m-1">Python</button>
                                            <button type="button" className="btn btn-outline-primary m-1">Linux</button>
                                            <button type="button" className="btn btn-outline-primary m-1">PostgreSQL</button>
                                            <button type="button" className="btn btn-outline-primary m-1">Управление проектами</button>
                                            <button type="button" className="btn btn-outline-primary m-1">MySQL</button>
                                            <button type="button" className="btn btn-outline-primary m-1">ООП</button>
                                            <button type="button" className="btn btn-outline-primary m-1">PHP</button>
                                            <button type="button" className="btn btn-outline-primary m-1">React</button>
                                            <button type="button" className="btn btn-outline-primary m-1">Java</button>
                                            <button type="button" className="btn btn-outline-primary m-1">Docker</button>
                                            <button type="button" className="btn btn-outline-primary m-1">Управление людьми</button>
                                            <button type="button" className="btn btn-outline-primary m-1">Адаптивная верстка</button>
                                            <button type="button" className="btn btn-outline-primary m-1">TypeScript</button>
                                            <button type="button" className="btn btn-outline-primary m-1">Английский язык</button>
                                            <button type="button" className="btn btn-outline-primary m-1">C#</button>
                                            <button type="button" className="btn btn-outline-primary m-1">Подбор специалистов</button>
                                            <button type="button" className="btn btn-outline-primary m-1">Веб-разработка</button>
                                            <button type="button" className="btn btn-outline-primary m-1">Adobe Photoshop</button>
                                            <button type="button" className="btn btn-outline-primary m-1">Node.js</button>
                                            <button type="button" className="btn btn-outline-primary m-1">Ведение переговоров</button>
                                        </div>

                                        <h6 className='mt-3'>Желаемая зарплата.</h6>
                                        <div className='w-75 d-flex flex-wrap-reverse align-items-center'>
                                            <input autoComplete='off' type="number" className="form-control w-50 me-3"></input>
                                            <select className="form-select w-25" aria-label="Default select example">
                                                <option selected>Валюта не указана</option>
                                                <option value="1">Рубли</option>
                                                <option value="2">Тенге</option>
                                                <option value="3">Доллар</option>
                                                <option value="3">Евро</option>
                                            </select>
                                        </div>
                                        <button type="button" className="btn btn-success mt-3">Сохранить</button>
                                    </form>
                                    
                                </div>
                            </div>
                            <div className="card m-0 p-3 bg-white my-3 text-decoration-none text-black">
                                <div className="card-body ps-0 pt-0 mt-0">
                                    <h5 className="card-title mb-3">Дополнительная информация</h5>
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label ">Сайт</label>
                                            <input autoComplete='off' type="password" className="form-control" id="exampleInputPassword1"></input>
                                            <div id="emailHelp" className="form-text">Ссылка на сайт.</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label ">ВК</label>
                                            <input autoComplete='off' type="password" className="form-control" id="exampleInputPassword1"></input>
                                            <div id="emailHelp" className="form-text">Ссылка на страницу ВКонтакте.</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label ">Facebook</label>
                                            <input autoComplete='off' type="password" className="form-control" id="exampleInputPassword1"></input>
                                            <div id="emailHelp" className="form-text">Ссылка на страницу Facebook.</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label ">Твиттер</label>
                                            <input autoComplete='off' type="password" className="form-control" id="exampleInputPassword1"></input>
                                            <div id="emailHelp" className="form-text">Ссылка на страницу Твиттер.</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label">Страна проживания</label>
                                            <select className="form-select" aria-label="Default select example" id="exampleInputPassword1">
                                                <option selected>Не указан</option>
                                                <option value="1">Казахстан</option>

                                                <option value="2">Россия</option>
                                                <option value="3">США</option>
                                                <option value="4">Китай</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="floatingTextarea2">Описание</label>
                                            <textarea className="form-control textarea-height-200 mt-2" placeholder="" id="floatingTextarea2"></textarea>
                                            <div id="emailHelp" className="form-text">Остальная информация</div>
                                        </div>
                                        
                                        
                                    
                                        <button type="button" className="btn btn-success mt-3">Сохранить</button>
                                    </form>
                                    
                                </div>
                            </div>
                        </section>
                    }
                    {nav === 'privacy' &&
                        <section>
                            <div className="card m-0 p-3 bg-white my-3 text-decoration-none text-black">
                                <div className="card-body ps-0 pt-0 mt-0">
                                    <h5 className="card-title mb-3" >Приватность</h5>
                                    <h6 className='mt-4'>Показывать доп. информацию</h6>
                                    <div className="form-check">
                                        <input autoComplete='off' className="form-check-input" type="radio" name="check_website_and_social_network" id="check_website_and_social_network1" checked></input>
                                        <label className="form-check-label" htmlFor="check_website_and_social_network1">
                                            Всем
                                        </label>
                                        </div>
                                        <div className="form-check">
                                        <input autoComplete='off' className="form-check-input" type="radio" name="check_website_and_social_network" id="check_website_and_social_network2"></input>
                                        <label className="form-check-label" htmlFor="check_website_and_social_network2">
                                            Только тем, на кого вы подписаны
                                        </label>
                                    </div>
                                    <h6 className='mt-4'>Показывать вашу активность на сайте</h6>
                                    <div className="form-check">
                                        <input autoComplete='off' className="form-check-input" type="radio" name="check_active_in_website" id="check_active_in_website1" checked></input>
                                        <label className="form-check-label" htmlFor="check_active_in_website1">
                                            Всем
                                        </label>
                                        </div>
                                        <div className="form-check">
                                        <input autoComplete='off' className="form-check-input" type="radio" name="check_active_in_website" id="check_active_in_website2"></input>
                                        <label className="form-check-label" htmlFor="check_active_in_website2">
                                            Только тем, на кого вы подписаны
                                        </label>
                                    </div>
                                    <button type="button" className="btn btn-success mt-3">Сохранить</button>
                                    
                                </div>
                            </div>
                        </section>
                    }
                    {nav === 'notifications' &&
                        <section>
                            <div className="card m-0 p-3 bg-white my-3 text-decoration-none text-black">
                                <div className="card-body ps-0 pt-0 mt-0">
                                    <h5 className="card-title mb-3" >Уведомления</h5>
                                    <h6 className='mt-4'>Уведомления в Telegram</h6>
                                    <div className="form-check">
                                        <input autoComplete='off' className="form-check-input" type="radio" name="check_website_and_social_network" id="check_website_and_social_network1" checked></input>
                                        <label className="form-check-label" htmlFor="check_website_and_social_network1">
                                            Да
                                        </label>
                                        </div>
                                        <div className="form-check">
                                        <input autoComplete='off' className="form-check-input" type="radio" name="check_website_and_social_network" id="check_website_and_social_network2"></input>
                                        <label className="form-check-label" htmlFor="check_website_and_social_network2">
                                            Нет
                                        </label>
                                    </div>
                                    <h6 className='mt-4'>Уведомлять о новых записях</h6>
                                    <div className="form-check">
                                        <input autoComplete='off' className="form-check-input" type="radio" name="check_active_in_website" id="check_active_in_website1" checked></input>
                                        <label className="form-check-label" htmlFor="check_active_in_website1">
                                            Да
                                        </label>
                                        </div>
                                        <div className="form-check">
                                        <input autoComplete='off' className="form-check-input" type="radio" name="check_active_in_website" id="check_active_in_website2"></input>
                                        <label className="form-check-label" htmlFor="check_active_in_website2">
                                            Нет
                                        </label>
                                    </div>

                                    <h6 className='mt-4'>Уведомлять о комментраиях под постами</h6>
                                    <div className="form-check">
                                        <input autoComplete='off' className="form-check-input" type="radio" name="notification_comments_under_posts" id="notification_comments_under_posts1" checked></input>
                                        <label className="form-check-label" htmlFor="notification_comments_under_posts1">
                                            Да
                                        </label>
                                        </div>
                                        <div className="form-check">
                                        <input autoComplete='off' className="form-check-input" type="radio" name="notification_comments_under_posts" id="notification_comments_under_posts2"></input>
                                        <label className="form-check-label" htmlFor="notification_comments_under_posts2">
                                            Нет
                                        </label>
                                    </div>

                                    <h6 className='mt-4'>Уведомлять о запросах в друзья</h6>
                                    <div className="form-check">
                                        <input autoComplete='off' className="form-check-input" type="radio" name="notification_new_friend" id="notification_new_friend1" checked></input>
                                        <label className="form-check-label" htmlFor="notification_new_friend1">
                                            Да
                                        </label>
                                        </div>
                                        <div className="form-check">
                                        <input autoComplete='off' className="form-check-input" type="radio" name="notification_new_friend" id="notification_new_friend2"></input>
                                        <label className="form-check-label" htmlFor="notification_new_friend2">
                                            Нет
                                        </label>
                                    </div>
                                    <button type="button" className="btn btn-success mt-3">Сохранить</button>
                                    
                                </div>
                            </div>
                        </section>
                    }
                    
                </div>
               
            </div>
        </div>
    );
}

export default Settings;
