import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import { Link, ScrollRestoration, useParams } from "react-router-dom";

function Community (props: any) { 
    const { id } = useParams(); 
    
    return (
        <div className="Home text-black">
            <div className='' >
                <Header page='Community'/>
            </div>
            <div className="w-100 h-100">
                
            </div>
        </div>
    );
}

export default Community;
