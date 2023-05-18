import React, { useEffect, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import Card from '../components/Card';
import News from '../components/News';
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
                        <div className='col-8 py-3'>
                            <div className="card m-0 p-0 bg-white">
                                <h4 className="card-header bg-white w-100 py-3">
                                    Лента
                                </h4>
                            </div>
                            <div className="tab-content m-0 p-0 mt-3" id="pills-tabContent">
                                <section className=''>
                                    <Card 
                                        title='Как использовать промты в ChatGPT для генерации кода на Python' 
                                        who='Company'
                                        description='Привет, друзья! Сегодня я хочу рассказать вам о том, как использовать промты в ChatGPT для создания программного кода на Python. Если вы работаете с Python или интересуетесь программированием, то вы, наверняка, знаете, насколько важно уметь быстро и эффективно создавать код.

                                        Для тех, кто не знаком с термином "промт", это специальные подсказки, которые выводятся в интерактивной среде Python и позволяют пользователю быстро и легко вводить команды. Обычно они выводятся в виде текста, который предлагает пользователю варианты продолжения его команды.

                                        Чатбот ChatGPT основан на искусственном интеллекте и способен генерировать текст на основе предыдущих входных данных. Таким образом, мы можем использовать его для генерации промтов для создания кода на Python.

                                        После множества экспериментов и ошибок, я нашел наиболее оптимальный промт для работы с ChatGPT, который позволяет мне полностью автоматизировать процесс разработки программы в соответствии с моим ТЗ. Сейчас я готов поделиться с вами своим опытом.'
                                        img_url='https://hsto.org/r/w1560/getpro/habr/upload_files/a35/c93/4fb/a35c934fb02dcef6687214136bc7f2cc.png'
                                        articale_id='1'
                                         count_likes="12" 
                                         bookmark_active={false} 
                                    />
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
                                </section>
                            </div>

                        </div>
                        <div className='col-4 position-relative p-0 m-0'>
                            <div className='padding-top-20-px'>
                                <SmartSearch/>
                            </div>
                            <div className="card p-3 m-2 bg-white mb-3 text-decoration-none text-black">
                                <h5 className="card-title">Новости</h5>
                                <div className="card-body ps-0">
                                    <div className="card-text">
                                        <div className="list-group">                                            
                                            <News id='1' title='Оцень интересная новость1.' content='And some muted small print1.'/>
                                            <News id='2' title='Оцень интересная новость2.' content='And some muted small print2.'/>
                                            <News id='3' title='Оцень интересная новость3.' content='And some muted small print3.'/>
                                            <News id='4' title='Оцень интересная новость4.' content='And some muted small print4.'/>
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
