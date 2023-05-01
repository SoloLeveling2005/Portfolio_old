import React, { useEffect, useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';


function Comment(props:{'id':string, 'title':string, 'comment':string}) {
    const id = props.id
    const title = props.title
    const comment = props.comment

    return (
        <div className="card m-0 p-3 bg-white text-decoration-none text-black mb-2">
            <Link to={`/article/${id}`} className=""><h5 className="card-title mb-1 pb-1">{title}</h5></Link>
            <div className="card-body ps-0 py-1">
                <p className="card-text">
                    {comment}
                </p>
            </div>
        </div>
    );
}

export default Comment;
