import React, { useEffect, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import { Link } from 'react-router-dom';

function Advertisement(props:{
        'landing_page_url':string, 
        'img_url':string, 
    }) {
    const landing_page_url = props.landing_page_url
    const img_url = props.img_url

    return (
        <Link to={landing_page_url} className="card">
            <div className="card-body">
                <h5 className='mb-3'>Предложение</h5>
                <img src={img_url} alt="" className='w-100'/>
            </div>
        </Link>
    );
}

export default Advertisement;
