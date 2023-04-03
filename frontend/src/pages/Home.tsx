import React, { useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import '../assets/img/send.png'
import Header from '../components/Header';

function Home() {
    const [articles, setArticle] = useState([{}])
    // let new_articles = []
    // for (let index = 10; index > 0; index--) {
    //     new_articles.push({
    //         'id': index,
    //         'title': 'title'+index,
    //         'description': 'description'+index
    //     })        
    // }
    // setArticle([...new_articles]);
    return (
        <div className="Home text-white">
            <div className=''>
                <Header/>
            </div>
            <div className="w-100 h-100">
                <div className='table container'>
                    <div className="row">
                        <div className='col py-3'>
                            <div className="card m-0 p-0 bg-white">
                                <h5 className="card-header w-100 ">
                                    Активность
                                </h5>
                                <div className="card-body">
                                    <ul className="nav nav-pills" id="pills-tab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Новости</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Новости сообществ</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Сообщества</button>
                                        </li>
                                    </ul>

                                </div>
                            </div>

                            <div className="tab-content m-0 p-0 mt-4" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    {articles.map((item, index) => (
                                        <section>
                                            <div className="card m-0 p-3 bg-white mb-3">
                                                <h5 className="card-title">LAION и энтузиасты по всему миру разрабатывают Open Assistant — открытый аналог ChatGPT</h5>
                                                <span className='card-title-company mb-3 cursor-pointer'>Cтатья компании Company</span>
                                                <img src="https://hsto.org/r/w1560/getpro/habr/upload_files/829/a55/1fa/829a551facb757c2c2c827c243d561a2.png" className="card-img-top" alt="..."></img>
                                                <div className="card-body ps-0">
                                                    <p className="card-text">Некоммерческая организация LAION и энтузиасты по всему миру занимаются разработкой Open Assistant — это проект, цель которого в предоставлении всем желающим доступа к продвинутой большой языковой модели, основанной на принципах чат-бота, с конечной целью революции в инновациях в области обработки естественного языка...</p>
                                                    <a href="#" className="btn btn-primary">Подробнее</a>
                                                </div>
                                            </div>
                                            <div className="card m-0 p-3 bg-white mb-3">
                                                <h5 className="card-title mb-4">Создание и тестирование процессоров аннотаций (с кодогенерацией) для Kotlin</h5>
                                                <img src="https://hsto.org/r/w1560/getpro/habr/upload_files/4fc/75b/5eb/4fc75b5ebe9f1c60cb9a2f07a9fecda2.png" className="card-img-top" alt="..."></img>
                                                <div className="card-body ps-0">
                                                    <p className="card-text">В разработке с использованием Kotlin (или Java) для создания классов по верхнеуровневому описанию часто используется маркировка аннотациями (например, для моделей таблиц баз данных, сетевых запросов или инъекции зависимостей) и подключение процессоров аннотаций, которые также могут генерировать код, доступный из основного проекта. Запуск процессоров аннотаций выполняется внутри gradle (для Java-проектов через annotationProcessor, для Kotlin - kapt) и встраивается как зависимость для целей сборки проекта. И конечно же, как и для любого другого кода, для процессора аннотаций необходимо иметь возможность разрабатывать тесты. В этой статье мы рассмотрим основы использования кодогенерации (с использованием kapt) и разработки тестов для созданных генераторов кода. Во второй части статьи речь пойдет о разработке процессоров на основе Kotlin Symbol Processing (KSP) и созданию тестов для них.</p>
                                                    <a href="#" className="btn btn-primary">Подробнее</a>
                                                </div>
                                            </div>
                                            <div className="card m-0 p-3 bg-white mb-3">
                                                <h5 className="card-title mb-4">Менеджмент зависимостей в Javascript</h5>
                                                <img src="https://hsto.org/r/w1560/getpro/habr/upload_files/b35/be9/fd4/b35be9fd4106e6e52b741b2f353ff605.png" className="card-img-top" alt="..."></img>
                                                <div className="card-body ps-0">
                                                    <p className="card-text">Для многих разработчиков процесс установки зависимостей представляет собой некую "магию", которая происходит при выполнении npm install. Понимание принципов работы этой "магии" может сильно помочь при возникновении ошибки во время установки очередной библиотеки. Нынешний NPM — результат многих лет проб и ошибок, поэтому для его детального понимания я предлагаю начать с самого начала.</p>
                                                    <a href="#" className="btn btn-primary">Подробнее</a>
                                                </div>
                                            </div>
                                        </section>
                                        
                                    ))}
                                </div>
                                <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">2</div>
                                <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">3</div>
                            </div>

                        </div>
                        <div className='col-4 position-relative p-0 m-0'>
                            <div className='padding-top-20-px position-sticky top-0'>
                                <div className="card m-0 p-0 bg-white mb-3 w-100 ">
                                    <h5 className="card-header w-100">Умный поиск</h5>
                                    <div className="card-body">
                                        <div className="answer_guestion mb-4">
                                            <span className="message">- Hello. There are some questions? Ask I will try to answer.</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <input type="email" className="form-control border border-2 me-2" id="exampleFormControlInput1" placeholder=""></input>
                                            <button className='btn btn-success'>Send</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    
                </div>
                
            </div>
        </div>
    );
}

export default Home;
