import React, { useEffect, useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import { Link } from 'react-router-dom';

function News(props:{'id':string, 'title':string, 'content':string}) {
    const id = props.id
    const title = props.title
    const content = props.content
    const [check, switchCheck] = useState(false);
    function switchCheckF () {
        
        if (check == false) {
            switchCheck(sw => (true))
            console.log("false")
        } else {
            switchCheck(sw => (false))
            console.log("true")
        }
    }


    return (
        <div className="list-group-item list-group-item-action" onClick={switchCheckF}>
            <p className="mb-1 fw-bold">{title}</p>
            <div className="">
                {check===true ? (
                    <small className="text-muted">
                        {content}
                        12
                    </small>
                ): null}
                
            </div>
        </div>
        
    );
}

export default News;
