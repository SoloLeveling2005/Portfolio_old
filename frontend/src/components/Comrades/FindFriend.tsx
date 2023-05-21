import React, { useEffect, useState } from 'react';
import '../../App.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/bootstrap.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config';

function MyFriend(props: { 'logo_url': string, 'id': string, 'username': string, parentFindFriends: any }) {
    const navigate = useNavigate();


    const logo_url = props.logo_url
    const id = props.id
    const username = props.username
    const findFriends = props.parentFindFriends

    


    const [friend, setfriend] = useState(Boolean);


    const [request_to_friend, setrequest_to_friend] = useState(Boolean);


    const [blacklist, setblacklist] = useState(Boolean);



    let countAbout = 0
    function about() {
        if (countAbout == 2) {
            alert('Ошибка поиска')
            countAbout = 0
            return
        }
        countAbout += 1


        axios.defaults.baseURL = API_BASE_URL
        axios.get(`users/user_about/${id}`, { headers: { 'Authorization': "Bearer " + localStorage.getItem('access_token') } })
            .then(response => {
                console.log(response.data)
                setfriend(response.data.friend)
                setrequest_to_friend(response.data.request_to_friend)
                setblacklist(response.data.blacklist)
                setTimeout(() => {
                    console.log(friend)
                    console.log(request_to_friend)
                    console.log(blacklist)
                }, 400)
            })
            .catch(error => {
                if (error.request.status === 401) {
                    axios.post('refresh_token', { 'refresh': localStorage.getItem('refresh_token') })
                        .then(response => {
                            localStorage.setItem('access_token', response.data.access)

                            // Запрашиваем данные снова
                            about()
                        })
                        .catch(error => { console.log(error); navigate('/auth'); });
                }
            });
    }

    let countCreateFriendRequest = 0
    function createFriendRequest() {
        if (countCreateFriendRequest == 3) {
            alert('Ошибка поиска')
            countCreateFriendRequest = 0
            return
        }
        countCreateFriendRequest += 1

        axios.defaults.baseURL = API_BASE_URL
        axios.post(`users/create_request_in_friend`, { 'subscriber_id': id }, { headers: { 'Authorization': "Bearer " + localStorage.getItem('access_token') } })
            .then(response => {
                findFriends();
                about();
            })
            .catch(error => {
                if (error.request.status === 401) {
                    axios.post('refresh_token', { 'refresh': localStorage.getItem('refresh_token') })
                        .then(response => {
                            localStorage.setItem('access_token', response.data.access)

                            // Запрашиваем данные снова
                            createFriendRequest()
                        })
                        .catch(error => { console.log(error); navigate('/auth'); });
                }
            });
    }

    let countDeleteriendRequest = 0
    function deleteriendRequest() {
        if (countDeleteriendRequest == 3) {
            alert('Ошибка поиска')
            countDeleteriendRequest = 0
            return
        }
        countDeleteriendRequest += 1

        axios.defaults.baseURL = API_BASE_URL
        axios.delete(`users/delete_request_in_friend/${id}`, {
            headers: { 'Authorization': "Bearer " + localStorage.getItem('access_token') }
        })
        .then(response => {
            findFriends();
            about();
        })
        .catch(error => {
            if (error.request.status === 401) {
                axios.post('refresh_token', {'refresh': localStorage.getItem('refresh_token')})
                .then(response => {
                    localStorage.setItem('access_token', response.data.access)

                    // Запрашиваем данные снова
                    deleteriendRequest()
                })
                .catch(error => {console.log(error); navigate('/auth');});
            }
        });
    }



    let countAddToBlacklist = 0
    function addToBlacklist() {
        if (countAddToBlacklist == 3) {
            alert('Ошибка поиска')
            countAddToBlacklist = 0
            return
        }
        countAddToBlacklist += 1

        axios.defaults.baseURL = API_BASE_URL
        axios.post(`users/post_add_user_in_blacklist`,{'user_id':id}, { headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')}})
        .then(response => {
            findFriends();
            about();
        })
        .catch(error => {
            if (error.request.status === 401) {
                axios.post('refresh_token', {'refresh': localStorage.getItem('refresh_token')})
                .then(response => {
                    localStorage.setItem('access_token', response.data.access)

                    // Запрашиваем данные снова
                    addToBlacklist()
                })
                .catch(error => {console.log(error); navigate('/auth');});
            }
        });
    }

    

    // Вызываем один раз.
    useEffect(() => {
        about()
    }, []);

    if (blacklist) return (<div></div>);
    return (
        <div className="card mb-1 w-49">
            <div className="d-flex p-0 m-0 mx-2">
                <div className="m-0 d-flex align-items-center justify-content-center">
                    <img src={logo_url} alt="" className='friend-logo rounded-2 p-1 border ' />
                </div>
                <div className="p-0 m-0 w-100">
                    <div className="card-body my-0 py-2 d-flex flex-wrap flex-column w-100">
                        <Link to={`/user/${id}`} className="card-title fs-5 fw-bold d-flex align-items-center justify-content-between w-100">
                            {username}
                            {request_to_friend == true && 
                                <span className='fs-6 fw-light text-success'>Запрос отправлен</span>
                            }
                            {friend == true && 
                                <span className='fs-6 fw-light text-success'>Друг</span>
                            }
                        </Link>
                        <div className='d-flex align-items-center'>
                            {request_to_friend == true ? (
                                <button onClick={deleteriendRequest} className="btn btn-warning text-white py-1 px-3 me-2"><small>Удалить запрос в друзья</small></button>
                            ): (
                                <button onClick={createFriendRequest} className="btn btn-success py-1 px-3 me-2"><small>В друзья</small></button> 
                            )
                                
                            }
                            
                            {/* <button onClick={addToBlacklist} className="btn btn-danger py-1 px-3"><small>В ЧС</small></button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyFriend;
