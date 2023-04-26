import React, { useEffect, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import { Link } from 'react-router-dom';

function Card(props:{'title':string, 'img_url':string, 'articale_url':string, 'description':string, 'who':string}) {
    const title = props.title
    const img_url = props.img_url
    const articale_url = props.articale_url
    const description = props.description
    const who = props.who


    return (
        <div className="card m-0 p-3 bg-white mb-3">
            <Link to={articale_url} className="card-title mb-2 fs-5">{title}</Link>
            <span className='card-title-company mb-3 cursor-pointer'>Cтатья компании {who}</span>
            <div className='card-img-top'>
                <img src={img_url} className="w-100" alt="..."></img>
            </div>
            <div className="card-body ps-0">
                <p className="card-text">{description}</p>
            </div>
            <div className='d-flex mt-2'>
                <div className='d-flex align-items-center  me-3 ms-1'>
                    <img src="/img/like_active.png" alt="Отзыв" title='Отзыв' className='img-small-20 cursor-pointer me-1' />
                    11
                </div>
                <div className='d-flex align-items-center  me-3 ms-1'>
                    <img src="/img/bookmark_active.png" alt="В закладки" title='В закладки' className='img-small-20 cursor-pointer me-1' />
                    15
                </div>
                <div className='d-flex align-items-center  me-3 ms-1'>
                    <img src="/img/comment.png" alt="Комментарий" title='Комментарий' className='img-small-20 cursor-pointer me-1' />
                </div>
            </div>
        </div>
        
    );
}

export default Card;
