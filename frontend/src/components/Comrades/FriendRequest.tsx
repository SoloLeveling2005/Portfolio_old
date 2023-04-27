import React, { useState } from 'react';
import '../../App.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/bootstrap.css';
import { Link } from 'react-router-dom';

function MyFriend(props:{'logo_url':string,'id':string, 'username':string}) {
    const logo_url = props.logo_url
    const id = props.id
    const username = props.username

    return (
        <div className="card mb-1">
            <div className="d-flex p-0 m-0 mx-2">
                <div className="m-0 d-flex align-items-center justify-content-center">
                    <img src={logo_url} alt="" className='friend-logo rounded-2' />
                </div>
                <div className="p-0 m-0">
                    <div className="card-body">
                        <h5 className="card-title">{username}</h5>
                        <a href="#" className="btn btn-primary me-2 py-1 px-3 m-0 me-2"><small>Принять заявку</small></a>
                        <a href="#" className="btn btn-danger py-1 px-3 m-0"><small>В черный список</small></a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyFriend;
