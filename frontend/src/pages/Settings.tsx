import React, { useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import Smart_search from '../components/SmartSearch';
import { Link } from 'react-router-dom';
import UserInfo from '../components/UserInfo';
import ActivityUser from '../components/ActivityUser';

function Settings() {

    // navbar 
    const [nav, switchNav] = useState('profile');
    function switchNavF (event:any) {
        const { value } = event.target;
        switchNav(sw => (value))
    }

    return (
        <div className="Home ">
            <div className=''>
                <Header/>
            </div>
            <div className="w-100 h-100 pb-3">
                <div className='container my-3'>
                    <div className="card m-0 p-0 bg-white">
                        <div className="card-body">
                            <h5 className="card-title">Настройки</h5>
                            <ul className="nav nav-pills pt-3" id="pills-tab" role="tablist">
                                {nav == 'profile' ? (
                                    <button className="nav-link active me-2" value="profile" onClick={switchNavF} type="button">Профиль</button>
                                ):(
                                    <button className="nav-link me-2" value="profile" onClick={switchNavF} type="button">Профиль</button>
                                )}
                                {nav == 'specialization' ? (
                                    <button className="nav-link active me-2" value="specialization" onClick={switchNavF} type="button">Специализация</button>
                                ):(
                                    <button className="nav-link me-2" value="specialization" onClick={switchNavF} type="button">Специализация</button>
                                )}
                                {nav == 'account' ? (
                                    <button className="nav-link active me-2" value="account" onClick={switchNavF} type="button">Аккаунт</button>
                                ):(
                                    <button className="nav-link me-2" value="account" onClick={switchNavF} type="button">Аккаунт</button>
                                )}
                                {nav == 'privacy' ? (
                                    <button className="nav-link active me-2" value="privacy" onClick={switchNavF} type="button">Приватность</button>
                                ):(
                                    <button className="nav-link me-2" value="privacy" onClick={switchNavF} type="button">Приватность</button>
                                )}
                                {nav == 'notifications' ? (
                                    <button className="nav-link active me-2" value="notifications" onClick={switchNavF} type="button">Уведомления</button>
                                ):(
                                    <button className="nav-link" value="notifications" onClick={switchNavF} type="button">Уведомления</button>
                                )}
                            </ul>
                        </div>
                    </div>
                    {nav == 'profile' &&
                        <section>
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

                                    
                                        <button type="submit" className="btn btn-success mt-3">Сохранить</button>
                                    </form>
                                    
                                </div>
                            </div>
                            <div className="card m-0 p-3 bg-white my-3 text-decoration-none text-black">
                                <div className="card-body ps-0 pt-0 mt-0">
                                    <h5 className="card-title mb-3">Дополнительная информация</h5>
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label ">Сайт</label>
                                            <input type="password" className="form-control" id="exampleInputPassword1"></input>
                                            <div id="emailHelp" className="form-text">Ссылка на сайт.</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label ">ВК</label>
                                            <input type="password" className="form-control" id="exampleInputPassword1"></input>
                                            <div id="emailHelp" className="form-text">Ссылка на страницу ВКонтакте.</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label ">Facebook</label>
                                            <input type="password" className="form-control" id="exampleInputPassword1"></input>
                                            <div id="emailHelp" className="form-text">Ссылка на страницу Facebook.</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label ">Твиттер</label>
                                            <input type="password" className="form-control" id="exampleInputPassword1"></input>
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
                                        
                                        
                                    
                                        <button type="submit" className="btn btn-success mt-3">Сохранить</button>
                                    </form>
                                    
                                </div>
                            </div>
                        </section>
                    }

                    {nav == 'specialization' &&
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
                                        <input className="form-control" placeholder='Навыки' readOnly></input>
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
                                            <input type="number" className="form-control w-50 me-3"></input>
                                            <select className="form-select w-25" aria-label="Default select example">
                                                <option selected>Валюта не указана</option>
                                                <option value="1">Рубли</option>
                                                <option value="2">Тенге</option>
                                                <option value="3">Доллар</option>
                                                <option value="3">Евро</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-success mt-3">Сохранить</button>
                                    </form>
                                    
                                </div>
                            </div>
                            <div className="card m-0 p-3 bg-white my-3 text-decoration-none text-black">
                                <div className="card-body ps-0 pt-0 mt-0">
                                    <h5 className="card-title mb-3">Дополнительная информация</h5>
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label ">Сайт</label>
                                            <input type="password" className="form-control" id="exampleInputPassword1"></input>
                                            <div id="emailHelp" className="form-text">Ссылка на сайт.</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label ">ВК</label>
                                            <input type="password" className="form-control" id="exampleInputPassword1"></input>
                                            <div id="emailHelp" className="form-text">Ссылка на страницу ВКонтакте.</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label ">Facebook</label>
                                            <input type="password" className="form-control" id="exampleInputPassword1"></input>
                                            <div id="emailHelp" className="form-text">Ссылка на страницу Facebook.</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label ">Твиттер</label>
                                            <input type="password" className="form-control" id="exampleInputPassword1"></input>
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
                                        
                                        
                                    
                                        <button type="submit" className="btn btn-success mt-3">Сохранить</button>
                                    </form>
                                    
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
