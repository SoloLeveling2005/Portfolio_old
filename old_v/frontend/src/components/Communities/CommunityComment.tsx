import React, { useEffect, useState } from 'react';
import '../../App.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config';

function Comment(props: {
        'indent': number
        'user_id': string,
        'username': string,
        'text': string,
        'articleId': any,
        'parentGetArticle': any,
        'parentCommentId': string,
        'childComments': any
    // [{ comment: { child_comments: {}, info: { id: 0, content: '' }, user: { id: 0, username: '' } } }]
    }) {
    
    const navigate = useNavigate();

    // Проверку на авторизацию 
    let user = localStorage.getItem('username')
    if (user === null) {
        console.log(user)
        navigate('/auth')
    }


    const indent = props.indent + 50
    const indentStyle = {
        marginLeft: `${indent}px`
    }
    const user_id = props.user_id
    const username = props.username
    const text = props.text
    const articleId = props.articleId
    const parentGetArticle = props.parentGetArticle
    const parentCommentId = props.parentCommentId
    const childComments = props.childComments


    const [InputCommentContent, setInputCommentContent] = useState('');
    const handleChangeInputCommentContent = (event:any) => {
        setInputCommentContent(event.target.value);
    };

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
            'article_id': articleId,
            'comment_content': InputCommentContent,
            'parent_comment':parentCommentId
        }

        axios.defaults.baseURL = API_BASE_URL
        axios.post(`comment/create_comment`, body, { headers: { 'Authorization': "Bearer " + localStorage.getItem('access_token'),'Content-Type': 'multipart/form-data'} })
        .then(response => {
            console.log(response.data)
            // alert("Комментарий успешно создан")
            setInputCommentContent('')
            parentGetArticle()
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


    return (
        <div className='p-0'>
            <div className='mb-4'>
                <div className="card m-0 p-2 bg-white text-decoration-none text-black mb-2 w-50">
                    <div className="card-body ps-0 py-1">
                        <Link to={`/user/${user_id}`} className=""><h5 className="card-title m-0 p-0 mb-1 pb-1 ">{username}</h5></Link>
                        <p className="card-text ">
                            {text}
                        </p>
                    </div>
                    
                </div>
                <div className='d-flex align-items-center justify-content-between w-50'>
                    <input type="text" className="form-control me-2" value={InputCommentContent} onChange={handleChangeInputCommentContent} />
                    <button className='btn btn-primary' onClick={CreateComment}>Отправить</button>
                </div>
            </div>
            <div style={indentStyle}>
                {Array.isArray(childComments) && childComments.map((item, index) => (
                    <Comment indent={indent} childComments={Object.values(item.comment.child_comments)} user_id={item.comment.info.id.toString()} username={item.comment.user.username} text={item.comment.info.content} articleId={articleId} parentCommentId={item.comment.info.id.toString()} parentGetArticle={parentGetArticle} />
                ))}
            </div>
            
        </div>
        
        
        
    );
}

export default Comment;
