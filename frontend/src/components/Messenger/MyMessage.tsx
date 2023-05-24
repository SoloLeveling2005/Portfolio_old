import React, { useState } from 'react';
import '../../App.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/bootstrap.css';
import { Link } from 'react-router-dom';
function MyMessage(props:{'message':string}) {
    const message = props.message
    return (
        <div className="w-100 my mb-2">
            <div className="card message">
                <div className="card-body">
                    {message}
                </div>
            </div>
        </div>
    );
}

export default MyMessage;
