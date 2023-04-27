import React, { useState } from 'react';
import '../../App.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/bootstrap.css';
import { Link } from 'react-router-dom';

function Company(props:{'logo_url':string, 'signed':boolean, 'company_id':string, 'company_title':string}) {
    const logo_url = props.logo_url
    const company_id = props.company_id
    const signed = props.signed
    const company_title = props.company_title
    return (
        <div className="card mb-1">
            <div className="d-flex p-0 m-0 mx-2">
                <div className="m-0 d-flex align-items-center justify-content-center">
                    <img src={logo_url} alt="" className='friend-logo rounded-2' />
                </div>
                <div className="p-0 m-0">
                    <div className="card-body my-1">
                        <h5 className="card-title">{company_title}</h5>
                        {signed==false ? (
                            <a href="#" className="btn btn-primary py-1 px-3"><small>Вступить в компанию</small></a>
                        ):(
                            <a href="#" className="btn btn-danger py-1 px-3"><small>Покинуть компанию</small></a>  
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Company;
