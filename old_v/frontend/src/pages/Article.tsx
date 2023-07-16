import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import { Link, ScrollRestoration, useNavigate, useParams } from "react-router-dom";
import SmartSearch from '../components/SmartSearch';
import RelatedArticles from '../components/RelatedArticles';
import Comment from '../components/Comment';
import CommunityComment from '../components/Communities/CommunityComment';
import axios from 'axios';
import API_BASE_URL from '../config';

function Home(props: any) {
    const navigate = useNavigate();

    // Проверку на авторизацию 
    let user = localStorage.getItem('username')
    if (user === null) {
        console.log(user)
        navigate('/auth')
    }
    
    let { id } = useParams(); 
    let user_id = 1;
    const h2ref = useRef();

    const [InputParentCommentId, setInputParentCommentId] = useState('');
    const handleChangeInputParentCommentId = (event:any) => {
        setInputParentCommentId(event.target.value);
    };

    const [InputCommentContent, setInputCommentContent] = useState('');
    const handleChangeInputCommentContent = (event:any) => {
        setInputCommentContent(event.target.value);
    };

    // Динамические данные с сервера
    const [allComments, setAllComments] = useState([{ comment: { child_comments: {}, info:{id:0,content:''},user:{id:0,username:''}}}]);
    const [article, setArticle] = useState({title:'', content:'',description:'', img:''});
    const [author, setAuthor] = useState({id:0, username:''});

    
    let countGetArticle = 0
    function getArticle() {
        if (countGetArticle == 3) {
            alert('Ошибка поиска')
            countGetArticle = 0
            return
        }
        countGetArticle += 1


        axios.defaults.baseURL = API_BASE_URL
        axios.get(`article/get_article/${id}`, { headers: { 'Authorization': "Bearer " + localStorage.getItem('access_token') } })
        .then(response => {
            console.log(response.data)
            console.log(response.data.all_comments)
            setAllComments(Object.values(response.data.all_comments))
            setArticle(response.data.article)
            setAuthor(response.data.author)
            countGetArticle = 0
        })
        .catch(error => {
            if (error.request.status === 401) {
                axios.post('refresh_token', { 'refresh': localStorage.getItem('refresh_token') })
                .then(response => {
                    localStorage.setItem('access_token', response.data.access)

                    // Запрашиваем данные снова
                    getArticle()
                })
                .catch(error => { console.log(error); navigate('/auth'); });
            }
        });
    }



    let countCreateComment = 0
    function CreateComment() {
        if (countCreateComment == 3) {
            alert('Ошибка создания')
            countCreateComment = 0
            return
        }
        countCreateComment += 1

        if (InputCommentContent == '') {
            alert("Комментарий не введен")
            countCreateComment =  0
            return
        }

        let body = {
            'article_id': id,
            'comment_content': InputCommentContent
        }

        axios.defaults.baseURL = API_BASE_URL
        axios.post(`comment/create_comment`, body, { headers: { 'Authorization': "Bearer " + localStorage.getItem('access_token'),'Content-Type': 'multipart/form-data'} })
        .then(response => {
            console.log(response.data)
            // alert("Комментарий успешно создан")
            getArticle()
            setInputCommentContent('')
            countCreateComment = 0
        })
        .catch(error => {
            if (error.request.status === 401) {
                axios.post('refresh_token', { 'refresh': localStorage.getItem('refresh_token') })
                .then(response => {
                    localStorage.setItem('access_token', response.data.access)

                    // Пробуем еще раз 
                    CreateComment()
                })
                .catch(error => { console.log(error); navigate('/auth'); });
            }
        });
    }



    useEffect(() => {
        getArticle()
    }, []);

    
    return (
        <div className="Home text-black">
            <div className='' >
                <Header page='Article'/>
            </div>
            <div className="w-100 h-100">
                <div className='table container'>
                    <div className="row">
                        <div className='col py-3'>
                            <div className="card m-0 p-3 bg-white mb-3 text-decoration-none text-black">
                                <div className="card-title">
                                    <Link to={`/user/${author.id}`} className='text-dark fw-bold'>{author.username}</Link>
                                    <h5>{ article.title }</h5>
                                </div>
                                <div className="card-body ps-0 pt-1">
                                    <div className="card-text">
                                        <div className='pre_'>
                                            {article.content}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="card m-0 p-3 bg-white mb-3 text-decoration-none text-black">
                                <h5 className="card-title">Похожие запросы</h5>
                                <div className="card-body ps-0">
                                    <div className="card-text">
                                        <div className="list-group">
                                            <RelatedArticles id='1' title='Some placeholder content in a paragraph?'/>
                                            <RelatedArticles id='2' title='Some placeholder content in a paragraph?'/>
                                            <RelatedArticles id='3' title='Some placeholder content in a paragraph?'/>

                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <div className="card bg-white p-0 m-0 w-100">
                                <div className="card-body">
                                    <h5 className="card-title">Комментарии</h5>
                                    {Array.isArray(allComments) && allComments.map((item, index) => (
                                        <CommunityComment indent={0} user_id={item.comment.info.id.toString()} username={item.comment.user.username} text={item.comment.info.content} articleId={id?.toString()} childComments={Object.values(item.comment.child_comments)} parentCommentId={item.comment.info.id.toString()} parentGetArticle={getArticle} />
                                    ))}
                                    {/* <CommunityComment user_id='1' username='username' text='comment' /> */}
                                    {/* <CommunityComment user_id='2' username='username' text='comment'/> */}
                                    {/* <CommunityComment user_id='3' username='username' text='comment'/> */}
                                    <hr />
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <input type="text" className="form-control me-2" value={InputCommentContent} onChange={handleChangeInputCommentContent} />
                                        <button className='btn btn-success' onClick={CreateComment}>Отправить</button>
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
