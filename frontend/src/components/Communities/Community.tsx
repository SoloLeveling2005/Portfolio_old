import React, { useState } from 'react';
import '../../App.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/bootstrap.css';
import { Link } from 'react-router-dom';

function Community(props:{'logo_url':string, 'signed':boolean, 'id':string, 'title':string, 'description':string, 'subscribers':string, 'categories':Array<string>}) {
    const logo_url = props.logo_url
    const id = props.id
    const signed = props.signed
    const title = props.title
    const description = props.description
    const subscribers = props.subscribers
    const categories = props.categories
    return (
        <div className="card mb-3">
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={logo_url} className="img-fluid rounded-start h-100" alt="Company Image"></img>
                </div>
                <div className="col-md-8">
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text mb-2">{description}</p>
                    <p className="card-text m-0"><small className="text-muted">Категории: {categories.map((item)=>(
                        <button className='btn btn-secondary py-1 px-2 me-1'><small>item</small></button>
                    ))}</small></p>
                    <p className="card-text m-0 mb-1"><small className="text-muted">Подписчики: {subscribers}</small></p>
                    {signed==false ? (
                        <a href="#" className="btn btn-primary py-1 px-3"><small>Вступить в сообщество</small></a>
                    ):(
                        <a href="#" className="btn btn-danger py-1 px-3"><small>Покинуть сообщество</small></a>  
                    )}
                </div>
                </div>
            </div>
        </div>
    )
}

export default Community;
