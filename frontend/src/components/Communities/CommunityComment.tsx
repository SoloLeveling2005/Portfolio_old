import React, { useEffect, useState } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';


function Comment(props:{'user_id':string, 'username':string, 'text':string}) {
    const user_id = props.user_id
    const username = props.username
    const text = props.text

    return (
        <div className="card m-0 p-2 bg-white text-decoration-none text-black mb-2 w-50">
            
            <div className="card-body ps-0 py-1">
                <Link to={`/user/${user_id}`} className=""><h5 className="card-title m-0 p-0 mb-1 pb-1 ">{username}</h5></Link>
                <p className="card-text ">
                    {text}
                </p>
            </div>
        </div>
    );
}

export default Comment;
