import React, { useEffect, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import Card from '../components/Card';
import News from '../components/News';
import { Link, useNavigate } from 'react-router-dom';
import SmartSearch from '../components/SmartSearch';
import axios from 'axios';
import API_BASE_URL from "../config";

function Home() {
    const navigate = useNavigate();
    // Проверка на авторизацию 
    let user = localStorage.getItem('username')
    if (user === null) {
        navigate('/auth')
    }

    const [data, setData] = useState({
        page_articles: [{
            author: {
                id: 0,
                username: '',
            },
            community: {
                id: 0,
                title: '',
                short_info: '',
            },
            info: {
                img: '',
                title: '',
                content: '',
                description: '',
                id: 0,
            },
            count_likes:0
        }]

    });
    
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


    let countGetArticleFeed = 0
    function getArticleFeed() {
        if (countGetArticleFeed == 2) {
            alert('Ошибка поиска')
            countGetArticleFeed = 0
            return
        }
        countGetArticleFeed += 1


        // Получаем информацию о пользователе
        axios.defaults.baseURL = API_BASE_URL
        axios.get(`article/article_feed/1`, { headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')}})
            .then(response => {
                console.log(response.data)
                countGetArticleFeed = 0
                setData(response.data)

            })
            .catch(error => {
                if (error.request.status === 401) {
                    // Если сервер ответил что пользователь не авторизован, отправляем запрос на перезапуск access токена. Если это не помогает то выводим ошибку.
                    axios.post('refresh_token', {
                        'refresh': localStorage.getItem('refresh_token'),
                    })
                        .then(response => {
                            // 
                            localStorage.setItem('access_token', response.data.access)

                            // Запрашиваем данные снова
                            getArticleFeed()
                        })
                        .catch(error => {
                            console.log(error)
                            navigate('/auth');
                        });
                }
            });
    }

    // Вызываем один раз.
    useEffect(() => {
        getArticleFeed()
    }, []);
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
                                    {data.page_articles.map((item, index)=>(
                                        <Card
                                            key={index}
                                            title={item.info.title}
                                            who={item.community.title}
                                            description={item.info.description}
                                            img_url={API_BASE_URL+item.info.img}
                                            article_id={item.info.id.toString()}
                                            count_likes={item.count_likes.toString()}
                                            bookmark_active={false}
                                        />

                                    ))}

                                    {/*<Card */}
                                    {/*    title='LAION и энтузиасты по всему миру разрабатывают Open Assistant — открытый аналог ChatGPT' */}
                                    {/*    who='Company'*/}
                                    {/*    description='Некоммерческая организация LAION и энтузиасты по всему миру занимаются разработкой Open Assistant — это проект, цель которого в предоставлении всем желающим доступа к продвинутой большой языковой модели, основанной на принципах чат-бота, с конечной целью революции в инновациях в области обработки естественного языка...'*/}
                                    {/*    img_url='https://hsto.org/r/w1560/getpro/habr/upload_files/829/a55/1fa/829a551facb757c2c2c827c243d561a2.png'*/}
                                    {/*    articale_id='2'*/}
                                    {/*     count_likes="15" */}
                                    {/*     bookmark_active={true} */}
                                    {/*/>*/}
                                    {/*<Card */}
                                    {/*    title='Менеджмент зависимостей в Javascript' */}
                                    {/*    who='Company'*/}
                                    {/*    description='Для многих разработчиков процесс установки зависимостей представляет собой некую "магию", которая происходит при выполнении npm install. Понимание принципов работы этой "магии" может сильно помочь при возникновении ошибки во время установки очередной библиотеки. Нынешний NPM — результат многих лет проб и ошибок, поэтому для его детального понимания я предлагаю начать с самого начала.'*/}
                                    {/*    img_url='https://hsto.org/r/w1560/getpro/habr/upload_files/b35/be9/fd4/b35be9fd4106e6e52b741b2f353ff605.png'*/}
                                    {/*    articale_id='3'*/}
                                    {/*     count_likes="152" */}
                                    {/*     bookmark_active={true} */}
                                    {/*/>*/}
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
