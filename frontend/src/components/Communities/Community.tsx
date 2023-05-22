import React, { useEffect, useState } from 'react';
import '../../App.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/bootstrap.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config';

function Community(props:{'logo_url':string, 'id':string, 'title':string, 'description':string, 'subscribers':string, 'categories':Array<string>, }) {
    const logo_url = props.logo_url
    const id = props.id
    // const signed = false
    const title = props.title
    const description = props.description
    const subscribers = props.subscribers
    const categories = props.categories
    const recommended = false
    

    const navigate = useNavigate();
    const [admin, setAdmin] = useState(false);
    const [signed, setSigned] = useState(Boolean);
    const [subscribers_count, setSubscribers_count] = useState(Boolean);
    const [request_to_sign, setRequest_to_sign] = useState(1);

    let countAbout = 0
    function about() {
        if (countAbout == 2) {
            alert('Ошибка поиска')
            countAbout = 0
            return
        }
        countAbout += 1


        axios.defaults.baseURL = API_BASE_URL
        axios.get(`community/get_about_community/${id}`, { headers: { 'Authorization': "Bearer " + localStorage.getItem('access_token') } })
            .then(response => {
                console.log(response.data)
                setSigned(response.data.signed)
                setAdmin(response.data.admin)
                setSubscribers_count(response.data.subscribers_count)
                setRequest_to_sign(response.data.request_to_sign)
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

    let countCreateRequestToJoin = 0
    function createRequestToJoin() {
        if (countCreateRequestToJoin == 2) {
            alert("Ошибка поиска")
            countCreateRequestToJoin = 0
            return
        }
        countCreateRequestToJoin += 1
        

        axios.defaults.baseURL = API_BASE_URL
        axios.post(`community/post_request_to_join_participant`, { 'community_id':id } ,{ headers:{'Authorization':"Bearer "+localStorage.getItem('access_token')}})
        .then(response => {
            console.log(response.data)
            alert("Запрос на вступление отправлен, ожидайте")
            // Обнуляем значение count
            countCreateRequestToJoin = 0
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
                    createRequestToJoin()
                })
                .catch(error => {
                    console.log(error)
                    navigate('/auth');
                });
            }
            
        });
    }

    useEffect(() => {
        about()
    }, []);

    return (
        <div className="card mb-3">
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={logo_url} className="img-fluid rounded-start h-100" alt="Community Image"></img>
                </div>
                <div className="col-md-8">
                    <div className="card-body d-flex align-content-between flex-column h-100 justify-content-between">
                        <div>
                            <Link to={`/community/${id}`} className="card-title fs-5 w-100">{title}</Link>
                            <p className="card-text mb-2">{description}</p> 
                        </div>
                    
                        {/* <p className="card-text m-0"><small className="text-muted">Категории: {categories.map((item)=>(
                            <button className='btn btn-secondary py-1 px-2 me-1'><small>item</small></button>
                        ))}</small></p> */}
                        {/* <p className="card-text m-0 mb-1"><small className="text-muted">Подписчики: {subscribers}</small></p> */}
                        <div>
                            {signed==false ? (
                                <button onClick={createRequestToJoin} className="btn btn-primary py-1 px-3"><small>Вступить в сообщество</small></button>
                            ):(
                                <div> 
                                    {/* {recommended==false ? (
                                        <a href="#" className="btn btn-primary py-1 px-3"><small>Рекомендовать сообщество</small></a>
                                    ):(
                                        <a href="#" className="btn btn-danger py-1 px-3"><small>Отменить рекомендацию</small></a>
                                    )}    */}
                                </div>
                            )}
                            <Link to={`/community/${id}`} className="ms-2 btn btn-success py-1 px-3 me-2">Перейти в сообщество</Link>
                        </div>
                    
                </div>
                </div>
            </div>
        </div>
    )
}

export default Community;
