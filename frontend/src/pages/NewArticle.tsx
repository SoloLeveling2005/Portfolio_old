import React, { useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import Smart_search from '../components/SmartSearch';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UserInfo from '../components/UserInfo';
import ActivityUser from '../components/ActivityUser';



function NewArticle() {
    const navigate = useNavigate();

    // Проверку на авторизацию 
    let user = localStorage.getItem('username')
    if (user === null) {
        console.log(user)
        navigate('/auth')
    }

    
    const { id } = useParams(); 
    


    const [InputArticleTitle, setInputArticleTitle] = useState('');
    const handleChangeInputArticleTitle = (event:any) => {
        setInputArticleTitle(event.target.value);
    };

    const [InputArticleDescription, setInputArticleDescription] = useState('');
    const handleChangeInputArticleDescription = (event:any) => {
        setInputArticleTitle(event.target.value);
    };

    const [InputArticleContent, setInputArticleContent] = useState('');
    const handleChangeInputArticleContent = (event:any) => {
        setInputArticleTitle(event.target.value);
    };
        
        
    
    
    
    return (
        <div className="Home ">
            <div className=''>
                <Header page='NewArticle'/>
            </div>
            <div className="w-100 h-100 pb-3">
                <div className="container pt-3">
                    <div className="card bg-white">
                        <div className="card-body">
                            <h5>Создание новой статьи</h5>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Заголовок статьи</label>
                                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="" value={InputArticleTitle} onChange={handleChangeInputArticleTitle}></input>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Описание статьи</label>
                                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="" value={InputArticleDescription} onChange={handleChangeInputArticleDescription}></input>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlTextarea1" className="form-label">Контент статьи</label>
                                <textarea className="form-control" id="exampleFormControlTextarea1" maxLength={700} rows={8} value={InputArticleContent} onChange={handleChangeInputArticleContent}></textarea>
                            </div>
                            <div className="mb-1 mt-2">
                                <label htmlFor="file-input" className="form-label">Выберите картинку</label>
                                <input autoComplete='off' className="form-control btn" type="file" accept="image/*" id="file-input" readOnly></input>
                            </div>
                            <hr />
                            <h5>Доп. контекст (необязателен для заполнения) (Не реализован)</h5>
                            <p>Вопрос-ответ будет использоваться языковой моделью (умный поиск). Вопрос ответ берется с вашего "Контент статьи". При выдачи результатов с вашего запроса будет выводиться так же источник ответа. Тоесть ваша статья.</p>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className='col-3'>Вопрос</th>
                                        <th className='col'>Ответ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <input type="text" className='form-control' placeholder='Вопрос'/>
                                        </td>
                                        <td>
                                            <input type="text" className='form-control' placeholder='Ответ'/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type="text" className='form-control' placeholder='Вопрос'/>
                                        </td>
                                        <td>
                                            <input type="text" className='form-control' placeholder='Ответ'/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type="text" className='form-control' placeholder='Вопрос'/>
                                        </td>
                                        <td>
                                            <input type="text" className='form-control' placeholder='Ответ'/>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button className='btn btn-primary w-100'>Опубликовать статью</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
                   
    );
}

export default NewArticle;
