import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import { Link, ScrollRestoration, useParams } from "react-router-dom";
import Card from '../components/Card';
import News from '../components/News';

function Community (props: any) { 
    const { id } = useParams(); 
    const [nav, switchNav] = useState('profile');

    function switchNavF (event:any) {
        const { value } = event.target;
        switchNav(sw => (value))
    }


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
                                        <img src="https://hsto.org/getpro/habr/company/9ed/c74/6b4/9edc746b484c805ecad1f941b5f7068a.png" alt="" className='img-normal-50' />
                                        <h4 className='pb-1 mb-0 mt-1'>VK</h4>
                                        <p>Технологии, которые объединяют</p>
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
                                                    <p className=''>Мобильные технологии</p>,<p className='ms-1'>Веб-сервисы</p>,<p className='ms-1'>Игры и развлечения</p>
                                                </div>
                                                <h6 className='mb-0'>О сообществе</h6>
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
                                    <div className="card p-0  bg-white mb-3 text-decoration-none text-black">
                                        <div className="list-group m-0">   
                                            <News id='1' title='News' content='Description news'/>
                                            <News id='2' title='News' content='Description news'/>
                                            <News id='3' title='News' content='Description news'/>
                                        </div>
                                    </div>
                                }     
                                {nav == 'participants' && 
                                    <div className="card bg-white">
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
                                                </tr>
                                            </thead> 
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <Link to={`/user/1`}>Username</Link>
                                                    </td>
                                                    <td>
                                                        user
                                                    </td>
                                                    <td>
                                                        122
                                                    </td>
                                                </tr> 
                                                <tr>
                                                    <td>
                                                        <Link to={`/user/1`}>Username</Link>
                                                    </td>
                                                    <td>
                                                        user
                                                    </td>
                                                    <td>
                                                        122
                                                    </td>
                                                </tr>    
                                            </tbody>   
                                        </table>                                        
                                    </div>
                                }        
                                {nav == 'settings' && 
                                    <div className='p-0 m-0'>
                                        <div className="card m-0 p-3 bg-white my-3 text-decoration-none text-black">
                                            <div className="card-body ps-0 pt-0 mt-0">
                                                <h5 className="card-title mb-3" >Основной</h5>
                                                <form>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleInputEmail1" className="form-label ">Настоящие имя и фамилия</label>
                                                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"></input>
                                                        <div id="emailHelp" className="form-text">Укажите ваши имя и фамилию, чтобы другие пользователи смогли узнать, как вас зовут</div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleInputPassword1" className="form-label ">Немного о вас</label>
                                                        <input type="password" className="form-control" id="exampleInputPassword1"></input>
                                                        <div id="emailHelp" className="form-text">Напишите небольшое описание себя.</div>
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
                                                        <div className="table">
                                                            <div className="row">
                                                                <div className="col">
                                                                    <label htmlFor="exampleInputPassword1" className="form-label mb-0">Пол</label>
                                                                    <select className="form-select" aria-label="Default select example" id="exampleInputPassword1">
                                                                        <option selected>Не указан</option>
                                                                        <option value="man">Мужской</option>
                                                                        <option value="woman">Женский</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col d-flex flex-column justify-content-end">
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
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                    <div className="mb-3 mt-4">
                                                        <label htmlFor="formFileReadonly" className="form-label">Выберите аватарку</label>
                                                        <input className="form-control btn" type="file" id="formFileReadonly" readOnly></input>
                                                    </div>

                                                
                                                    <button type="button" className="btn btn-success mt-3">Сохранить</button>
                                                </form>
                                                
                                            </div>
                                        </div>
                                    </div>
                                }     
                            </div>
                            <div className='col-3 position-relative p-0 m-0'>
                                <div className='padding-top-20-px position-sticky top-0'>
                                    {nav == 'profile' ? (
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className='mb-3'>Предложение</h5>
                                                <img src="https://hsto.org/getpro/habr/widget/4b4/92d/44f/4b492d44fd837fedf2fe66cfdf1b9a57.png" alt="" className='w-100'/>
                                            </div>
                                        </div>
                                        
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
                                            <div className="card">
                                                <div className="card-body">
                                                    <h5 className='mb-3'>Предложение</h5>
                                                    <img src="https://hsto.org/getpro/habr/widget/4b4/92d/44f/4b492d44fd837fedf2fe66cfdf1b9a57.png" alt="" className='w-100'/>
                                                </div>
                                            </div>
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
