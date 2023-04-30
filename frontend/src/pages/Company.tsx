import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import { Link, ScrollRestoration, useParams } from "react-router-dom";
import ActivityUser from '../components/ActivityUser';
import UserInfo from '../components/UserInfo';

function Company (props: any) { 
    const { id } = useParams(); 
    const [nav, switchNav] = useState('profile');

    function switchNavF (event:any) {
        const { value } = event.target;
        switchNav(sw => (value))
    }

    return (
        <div className="Home text-black">
            <div className='' >
                <Header page='Company'/>
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
                                        <img src="https://hsto.org/getpro/habr/company/9ed/c74/6b4/9edc746b484c805ecad1f941b5f7068a.png" alt="" className='img-normal-50' />
                                        <h4 className='pb-1 mb-0 mt-1'>VK</h4>
                                        <p>Технологии, которые объединяют</p>
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
                                            {nav == 'news' ? (
                                                <button className='btn btn-primary me-2' value='news' onClick={switchNavF}>Новости</button>
                                            ):(
                                                <button className='btn me-2' value='news' onClick={switchNavF}>Новости</button>
                                            )}
                                            {nav == 'communities' ? (
                                                <button className='btn btn-primary me-2' value='communities' onClick={switchNavF}>Сообщества</button>
                                            ):(
                                                <button className='btn me-2' value='communities' onClick={switchNavF}>Сообщества</button>
                                            )}
                                            {nav == 'participants' ? (
                                                <button className='btn btn-primary me-2' value='participants' onClick={switchNavF}>Участники</button>
                                            ):(
                                                <button className='btn me-2' value='participants' onClick={switchNavF}>Участники</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {nav == 'profile' && 
                                <div className="card m-0 p-0 bg-white mb-3 w-100 ">
                                    
                                    <div className="card-body">
                                        <h5 className='mb-3'>Профиль</h5>
                                        <div>
                                            <h6 className='mb-0'>Отрасли</h6>
                                            <div className='d-flex'>
                                                <p className=''>Мобильные технологии</p>,<p className='ms-1'>Веб-сервисы</p>,<p className='ms-1'>Игры и развлечения</p>
                                            </div>
                                            <h6 className='mb-0'>О компании</h6>
                                            <div className='d-flex'>
                                                <p>
                                                    Строим сервисы, используя силу социальных сетей.
                                                    <br />
                                                    Помогаем людям и компаниям объединяться вокруг того, что действительно важно.
                                                </p>
                                            </div>
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
                                </div>
                                }   
                                {nav == 'articles' && 
                                <div className="p-0 m-0">
                                    
                                    <div className="card m-0 p-3 bg-white mb-3 text-decoration-none text-black">
                                        <h5 className="card-title">Как использовать промты в ChatGPT для генерации кода на Python</h5>
                                        <span className='card-title-company mb-3 cursor-pointer'>Cтатья компании Company</span>
                                        <img src="https://hsto.org/r/w1560/getpro/habr/upload_files/a35/c93/4fb/a35c934fb02dcef6687214136bc7f2cc.png" className="card-img-top overflow-hidden object-fit-cover w-100" alt="..."></img>
                                        <div className="card-body ps-0">
                                            <p className="card-text">
                                                Привет, друзья! Сегодня я хочу рассказать вам о том, как использовать промты в ChatGPT для создания программного кода на Python. Если вы работаете с Python или интересуетесь программированием, то вы, наверняка, знаете, насколько важно уметь быстро и эффективно создавать код.

                                                Для тех, кто не знаком с термином "промт", это специальные подсказки, которые выводятся в интерактивной среде Python и позволяют пользователю быстро и легко вводить команды. Обычно они выводятся в виде текста, который предлагает пользователю варианты продолжения его команды.

                                                Чатбот ChatGPT основан на искусственном интеллекте и способен генерировать текст на основе предыдущих входных данных. Таким образом, мы можем использовать его для генерации промтов для создания кода на Python.

                                                После множества экспериментов и ошибок, я нашел наиболее оптимальный промт для работы с ChatGPT, который позволяет мне полностью автоматизировать процесс разработки программы в соответствии с моим ТЗ. Сейчас я готов поделиться с вами своим опытом.
                                            </p>
                                            <Link to={`/article/1`} className="btn btn-primary">Подробнее</Link>
                                        </div>
                                    </div>
                                </div>
                                }     
                                {nav == 'comments' && 
                                <div className="p-0 m-0">
                                    <div className="card m-0 p-3 bg-white text-decoration-none text-black mb-2">
                                        <Link to={`/article/1`} className=""><h5 className="card-title mb-1 pb-1">Как использовать промты в ChatGPT для генерации кода на Python</h5></Link>
                                        <div className="card-body ps-0 py-1">
                                            <p className="card-text">
                                                Комментарии
                                            </p>
                                            
                                        </div>
                                    </div>
                                    <div className="card m-0 p-3 bg-white text-decoration-none text-black mb-2">
                                        <Link to={`/article/1`} className=""><h5 className="card-title mb-1 pb-1">Как использовать промты в ChatGPT для генерации кода на Python</h5></Link>
                                        <div className="card-body ps-0 py-1">
                                            <p className="card-text">
                                                Комментарии
                                            </p>
                                            
                                        </div>
                                    </div>
                                    <div className="card m-0 p-3 bg-white text-decoration-none text-black mb-2">
                                        <Link to={`/article/1`} className=""><h5 className="card-title mb-1 pb-1">Как использовать промты в ChatGPT для генерации кода на Python</h5></Link>
                                        <div className="card-body ps-0 py-1">
                                            <p className="card-text">
                                                Комментарии
                                            </p>
                                            
                                        </div>
                                    </div>
                                    
                                    
                                </div>
                                }           
                            </div>
                            <div className='col-4 position-relative p-0 m-0'>
                                <div className='padding-top-20-px position-sticky top-0'>
                                    {/* <UserInfo country='Россия' registered='22 марта' last_login='сегодня в 01:11'/> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Company;
