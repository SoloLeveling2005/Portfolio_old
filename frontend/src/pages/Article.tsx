import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import { Link, ScrollRestoration, useParams } from "react-router-dom";
import SmartSearch from '../components/SmartSearch';

function Home (props: any) {
    let { id } = useParams(); 
    let user_id = 1;
    const h2ref = useRef();

    // устанавливаем прокрутку после рендеринга компонента
    

    
    return (
        <div className="Home text-black">
            <div className='' >
                <Header/>
            </div>
            <div className="w-100 h-100">
                <div className='table container'>
                    <div className="row">
                        <div className='col py-3'>
                            <div className="card m-0 p-3 bg-white mb-3 text-decoration-none text-black">
                                <div className="card-title">
                                    <Link to={`/user/${user_id}`} className='text-dark fw-bold'>Author</Link>
                                    <h5>Как использовать промты в ChatGPT для генерации кода на Python</h5>
                                </div>
                                <div className="card-body ps-0 pt-1">
                                    <div className="card-text">
                                        <div className='pre_'>
                                            <p>Привет, друзья! Сегодня я хочу рассказать вам о том, как использовать промты в ChatGPT для создания программного кода на Python. Если вы работаете с Python или интересуетесь программированием, то вы, наверняка, знаете, насколько важно уметь быстро и эффективно создавать код.</p>
                                            <p>Для тех, кто не знаком с термином "промт", это специальные подсказки, обычно они выводятся в виде текста, который указывает правила для ответа ИИ.</p>
                                            <p>Чатбот ChatGPT основан на искусственном интеллекте и способен генерировать текст на основе предыдущих входных данных, так же основан на copilot. Таким образом, мы можем использовать его для генерации промтов для создания кода на Python.</p>
                                            <p>После множества экспериментов и ошибок, я нашел наиболее оптимальный промт для работы с ChatGPT, который позволяет мне полностью автоматизировать процесс разработки программы в соответствии с моим ТЗ. Сейчас я готов поделиться с вами своим опытом.</p>
                                            <p>Промт:</p>
                                            <p>Тебе нужно принять роль Python программиста. Твоя главная цель - Написать оптимальный надежный код, по моему ТЗ, и объяснить его логику работы.</p>
                                            <p>Для достижения этой цели ты можешь:</p>
                                            <p>- Задавать мне уточняющие вопросы по моему ТЗ;</p>
                                            <p>- Предлагать различные варианты решения для выполнения ТЗ; </p>
                                            <p>- Писать оптимальный надежный код, который решает задачи из ТЗ;</p>
                                            <p>Используй технологии:</p>
                                            <p>- Python=3.10 версии;</p>
                                            <p>Целевая операционная система:</p>
                                            <p>- Linux;</p>
                                            <p>Требования к твоему ответу:</p>
                                            <p>- Пиши свой ответ по частям, и всегда указывай номер части;</p>
                                            <p>- В первой части напиши краткую устную реализацию задачи, план, и какие технологии ты будешь использовать для решения этой задачи, обосную почему именно их ты выбираешь, и какие есть еще возможные аналоги, на этом закончи свой первый ответ, и ожидай когда я одобрю твой план;</p>
                                            <p>- Во второй части напиши структуру проекта, продумай чтобы эта структура проекта была масштабируемая;</p>
                                            <p>- Во третей части напиши как установить зависимости, и если нужно, то какие программы нужно установить на целевую операционную систему.</p>
                                            <p>- В следующих главах напиши реализацию кода. Если это часть будет очень большой, то ты можешь разделить реализацию когда на сколько угодно глав;</p>
                                            <p>- В предпоследней части покажи пример использования; </p>
                                            <p>- В последней части напиши вывод;</p>
                                            <p>Требования к коду:  </p>
                                            <p>- Пиши комментарии в коде на русском языке, чтобы помочь другим людям понимать твой код. </p>
                                            <p>- Старайся использовать встроенные библиотеки, если это возможно, иначе укажи какие сторонние библиотеки нужно использовать для решения поставленной задачи, и напиши как их установить, если есть несколько сторонних библиотек для решения этой задачи, то нужно совместно со мной выбрать наиболее подходящею библиотеку. </p>
                                            <p>- Убедитесь, что код соответствует принципу разработки DRY (Don't Repeat Yourself) KISS(Keep it simple, stupid).</p>
                                            <p>- Используй аннотации типов.</p>
                                            <p>- Код должен быть разделен на функции, чтобы каждая функция решала определенную часть задачи. Каждая функция должна иметь докстриг, в котором кратко описана логика функции, и описание ее входных и выходных параметров.</p>
                                            <p>Пример:</p>
                                            <img src="https://hsto.org/r/w1560/getpro/habr/upload_files/a35/c93/4fb/a35c934fb02dcef6687214136bc7f2cc.png" className="w-100 my-2" alt="..."></img>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card m-0 p-3 bg-white mb-3 text-decoration-none text-black">
                                <h5 className="card-title">Вопросы и ответы</h5>
                                <div className="card-body ps-0">
                                    <div className="card-text">
                                    <div className="list-group">
                                        <a href="#" className="list-group-item list-group-item-action" aria-current="true">
                                            <div className="d-flex w-100 justify-content-between">
                                                {/* <h5 className="mb-1">List group item heading</h5> */}
                                                {/* <small>3 days ago</small> */}
                                            </div>
                                            <p className="mb-1 fw-bold">Some placeholder content in a paragraph?</p>
                                            <small>And some small print.</small>
                                        </a>
                                        <a href="#" className="list-group-item list-group-item-action">
                                            <div className="d-flex w-100 justify-content-between">
                                                {/* <h5 className="mb-1">List group item heading</h5> */}
                                                {/* <small className="text-muted">3 days ago</small> */}
                                            </div>
                                            <p className="mb-1 fw-bold">Some placeholder content in a paragraph?</p>
                                            <small className="text-muted">And some muted small print.</small>
                                        </a>
                                        <a href="#" className="list-group-item list-group-item-action">
                                            <div className="d-flex w-100 justify-content-between">
                                                {/* <h5 className="mb-1">List group item heading</h5> */}
                                                {/* <small className="text-muted">3 days ago</small> */}
                                            </div>
                                            <p className="mb-1 fw-bold">Some placeholder content in a paragraph?</p>
                                            <small className="text-muted">And some muted small print.</small>
                                        </a>
                                    </div>
                                    </div>
                                </div>
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
