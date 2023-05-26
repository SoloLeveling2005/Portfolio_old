import React, { useState } from 'react';
import '../../App.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/bootstrap.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config';

function MyFriend(props: { 'logo_url': string, 'id': string, 'username': string, parentgetRequestsToFriend: any, parentGetUserFriends: any, 'parentUpdateData':any }) {
    const navigate = useNavigate();

    
    const logo_url = props.logo_url
    const id = props.id
    const username = props.username
    const getRequestsToFriend = props.parentgetRequestsToFriend
    const parentGetUserFriends = props.parentGetUserFriends
    const parentUpdateData = props.parentUpdateData

    let countCreateFriend = 0
    function createFriend() {
        if (countCreateFriend == 3) {
            alert('Ошибка поиска')
            countCreateFriend = 0
            return
        }
        countCreateFriend += 1

        axios.defaults.baseURL = API_BASE_URL
        axios.post(`users/create_new_friend_subscriptions`, { 'user_id': id }, { headers: { 'Authorization': "Bearer " + localStorage.getItem('access_token') } })
            .then(response => {
                getRequestsToFriend()
            })
            .catch(error => {
                if (error.request.status === 401) {
                    axios.post('refresh_token', { 'refresh': localStorage.getItem('refresh_token') })
                        .then(response => {
                            localStorage.setItem('access_token', response.data.access)

                            // Запрашиваем данные снова
                            createFriend()
                            parentGetUserFriends()
                        })
                        .catch(error => { console.log(error); navigate('/auth'); });
                }
            });
    }




    return (
        <div className="card mb-1">
            <div className="d-flex p-0 m-0 mx-2">
                <div className="m-0 d-flex align-items-center justify-content-center">
                    <img src={logo_url} alt="" className='friend-logo rounded-2' />
                </div>
                <div className="p-0 m-0">
                    <div className="card-body d-flex flex-wrap flex-column">
                        <Link to={`/user/${id}`} className="card-title fs-5 fw-bold">{username}</Link>
                        <div>
                            <button onClick={createFriend} className="btn btn-primary me-2 py-1 px-3 m-0 me-2"><small>Принять заявку</small></button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyFriend;
