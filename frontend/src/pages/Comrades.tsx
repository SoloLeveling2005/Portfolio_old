import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';



import Header from '../components/Header';
import { Link, ScrollRestoration, useParams } from "react-router-dom";
import SmartSearch from '../components/SmartSearch';

function Comrades () {

    return (
        <div className="Home text-black">
            <div className='' >
                <Header page='Comrades'/>
            </div>
            <div className="w-100 h-100">
                <div className='table container'>
                    <div className="row">
                        <div className='col py-3'>
                            <div className="card bg-white">
                                <div className="card-body d-flex align-items-center justify-content-between p-1">
                                    <input type="text" className="form-control" />
                                    <button className='btn btn-primary ms-2'>Поиск</button>
                                </div>
                            </div>
                        </div>
                        <div className='col-4 position-relative p-0 m-0'>
                            
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default Comrades;
