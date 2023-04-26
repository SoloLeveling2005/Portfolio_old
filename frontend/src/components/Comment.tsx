import React, { useEffect, useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';


function Comment(props:{'id':string, 'post_title':string, 'comment':string}) {

    return (
        <div className="card m-0 p-3 bg-white text-decoration-none text-black mb-2">
            <Link to={`/article/${props.id}`} className=""><h5 className="card-title mb-1 pb-1">{props.post_title}</h5></Link>
            <div className="card-body ps-0 py-1">
                <p className="card-text">
                    {props.comment}
                </p>
            </div>
        </div>
    );
}

export default Comment;
