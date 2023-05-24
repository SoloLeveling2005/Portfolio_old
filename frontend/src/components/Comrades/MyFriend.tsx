import React, {useEffect, useState} from 'react';
import '../../App.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/bootstrap.css';
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from "../../config";

function MyFriend(props:{'logo_url':string,'id':string, 'username':string}) {
    const navigate = useNavigate();

    const logo_url = props.logo_url
    const id = props.id
    const username = props.username

    // rooms_data
    // Функция поиска друга
    let countCreateChat = 0
    function createChat() {
        if (countCreateChat == 3) {
            alert("Ошибка создания")
            countCreateChat = 0
            return
        }
        countCreateChat += 1


        axios.defaults.baseURL = API_BASE_URL
        axios.post(`messenger/create_room`,{'interlocutor_id':id}, { headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')}})
            .then(response => {
                console.log(response.data)
                navigate(`/messenger/${id}`)
                // Обнуляем значение
                countCreateChat = 0
            })
            .catch(error => {
                console.log(error)
                if (error.request.status === 401) {
                    // Если сервер ответил что пользователь не авторизован, отправляем запрос на перезапуск access токена. Если это не помогает то выводим ошибку.
                    axios.post('refresh_token', {
                        'refresh': localStorage.getItem('refresh_token'),
                    })
                        .then(response => {
                            //
                            localStorage.setItem('access_token', response.data.access)

                            // Запрашиваем данные снова
                            createChat()
                        })
                        .catch(error => {
                            console.log(error)
                            navigate('/auth');
                        });
                }

            });

    }

    // useEffect(() => {
    //
    // }, []);


    return (
        <div className="card mb-1">
            <div className="d-flex p-0 m-0 mx-2">
                <div className="m-0 d-flex align-items-center justify-content-center">
                    <img src={logo_url} alt="" className='friend-logo rounded-2' />
                </div>
                <div className="p-0 m-0">
                    <div className="card-body my-1 d-flex flex-wrap flex-column">
                        <Link to={`/user/${id}`} className="card-title fs-5 fw-bold">{username}</Link>
                        <a href="#" className=""></a>
                        <p onClick={createChat} className="text-primary cursor-pointer">Написать сообщение</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyFriend;
