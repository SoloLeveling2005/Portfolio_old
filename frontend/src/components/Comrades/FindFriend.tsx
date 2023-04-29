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
        <div className="card mb-1 w-49">
            <div className="d-flex p-0 m-0 mx-2">
                <div className="m-0 d-flex align-items-center justify-content-center">
                    <img src={logo_url} alt="" className='friend-logo rounded-2' />
                </div>
                <div className="p-0 m-0">
                    <div className="card-body my-0 py-2 d-flex flex-wrap flex-column">
                        <Link to={`/user/${id}`} className="card-title fs-5 fw-bold">{username}</Link>
                        <div className='d-flex align-items-center'>
                            <a href="#" className="btn btn-success py-1 px-3 me-2"><small>В друзья</small></a>
                            <a href="#" className="btn btn-danger py-1 px-3"><small>В ЧС</small></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyFriend;
