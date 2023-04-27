import React, { useState } from 'react';
import '../../App.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/bootstrap.css';
import { Link } from 'react-router-dom';

function Community(props:{'logo_url':string, 'signed':boolean, 'community_id':string, 'community_title':string}) {
    const logo_url = props.logo_url
    const community_id = props.community_id
    const signed = props.signed
    const community_title = props.community_title
    return (
        <div className="card mb-1">
            <div className="d-flex p-0 m-0 mx-2">
                <div className="m-0 d-flex align-items-center justify-content-center">
                    <img src="http://d4sport.ru/wp-content/uploads/2014/12/Prevyu-Volna2.jpg" alt="" className='friend-logo rounded-2' />
                </div>
                <div className="p-0 m-0">
                    <div className="card-body my-1">
                        <h5 className="card-title">{community_title}</h5>
                        {signed==false ? (
                            <a href="#" className="btn btn-primary">Подписаться</a>
                        ):(
                            <a href="#" className="btn btn-danger">Отписаться</a>  
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Community;
