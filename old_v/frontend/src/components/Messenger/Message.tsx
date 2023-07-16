import React, { useState } from 'react';
import '../../App.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/bootstrap.css';
import { Link } from 'react-router-dom';
function Message(props:{'username':string, 'message':string}) {
    const username = props.username
    const message = props.message
    return (
        <div className="w-100">
            <div className="card message">
                <div className="card-body">
                    <h6 className="card-title">{username}</h6>
                    <p className="card-text">{message}</p>
                </div>
            </div>
        </div>
    );
}

export default Message;
