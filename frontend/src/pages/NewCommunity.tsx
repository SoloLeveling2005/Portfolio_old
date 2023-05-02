import React, { useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import Header from '../components/Header';
import Smart_search from '../components/SmartSearch';
import { Link } from 'react-router-dom';
import UserInfo from '../components/UserInfo';
import ActivityUser from '../components/ActivityUser';

function NewCommunity() {

    // navbar 
    const [nav, switchNav] = useState('profile');
    function switchNavF (event:any) {
        const { value } = event.target;
        switchNav(sw => (value))
    }

    return (
        <div className="Home ">
            <div className=''>
                <Header page='NewCommunity'/>
            </div>
            <div className="w-100 h-100 pb-3">
                123
            </div>
        </div>
                   
    );
}

export default NewCommunity;
