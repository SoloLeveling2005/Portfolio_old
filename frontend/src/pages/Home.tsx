import React, { useEffect, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import SmartSearch from '../components/SmartSearch';

function Home() {
    const [articles, setArticle] = useState([{}]);
    
    const [scrollPosition, setScrollPosition] = useState(0);

    // устанавливаем прокрутку после рендеринга компонента
    useEffect(() => {
        window.scrollTo(0, scrollPosition);
    }, [scrollPosition]);


    // navbar 
    const [nav, switchNav] = useState('news');
    function switchNavF (event:any) {
        const { value } = event.target;
        switchNav(sw => (value))
    }

    return (
        <div className="Home text-white">
            <div className=''>
                <Header page='HomeNews'/>
            </div>
            <div className="w-100 h-100">
                <div className='table container'>
                    <div className="row">
                        <div className='col py-3'>
                            <div className="card m-0 p-0 bg-white">
                                <h4 className="card-header w-100 py-3">
                                    Новости
                                </h4>
                            </div>
                            <div className="tab-content m-0 p-0 mt-3" id="pills-tabContent">
                                <section>
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
                                            <div className='d-flex mt-3'>
                                                <img src="/img/like.png" alt="Выход" title='Выход' className='img-small-24 cursor-pointer me-4 ms-1' />
                                                <img src="/img/logout.png" alt="Выход" title='Выход' className='img-small-24 cursor-pointer me-4 ms-1' />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card m-0 p-3 bg-white mb-3 text-decoration-none text-black">
                                        <h5 className="card-title">LAION и энтузиасты по всему миру разрабатывают Open Assistant — открытый аналог ChatGPT</h5>
                                        <span className='card-title-company mb-3 cursor-pointer'>Cтатья компании Company</span>
                                        <img src="https://hsto.org/r/w1560/getpro/habr/upload_files/829/a55/1fa/829a551facb757c2c2c827c243d561a2.png" className="card-img-top" alt="..."></img>
                                        <div className="card-body ps-0">
                                            <p className="card-text">Некоммерческая организация LAION и энтузиасты по всему миру занимаются разработкой Open Assistant — это проект, цель которого в предоставлении всем желающим доступа к продвинутой большой языковой модели, основанной на принципах чат-бота, с конечной целью революции в инновациях в области обработки естественного языка...</p>
                                            <Link to={`/article/1`}  className="btn btn-primary">Подробнее</Link>
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
                            </div>

                        </div>
                        <div className='col-4 position-relative p-0 m-0'>
                            <div className='padding-top-20-px position-sticky top-0'>
                                <SmartSearch/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
