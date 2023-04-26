import React, { useEffect, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import { Link } from 'react-router-dom';

function News(props:{'id':string, 'title':string, 'content':string}) {
    const id = props.id
    const title = props.title
    const content = props.content


    return (
        <a className="list-group-item list-group-item-action" type="button" data-bs-toggle="collapse" data-bs-target={"#collapseExample"+id} aria-expanded="false" aria-controls="collapseExample">
            <p className="mb-1 fw-bold">{title}</p>
            <div className="collapse" id={"collapseExample"+id}>
                <small className="text-muted">
                    {content}
                </small>
            </div>
        </a>
        
    );
}

export default News;
