import React, { useState } from 'react';
import '../../App.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/bootstrap.css';
import { Link } from 'react-router-dom';
function Dialogue(props:{'title':string, 'img_url':string, 'id':string, 'onClick':any }) {
    let title = props.title
    let img_url = props.img_url

    const [chat, switchChat] = useState("");

    const switchChatF = () => {
        switchChat(props.id);
        props.onClick(props.id);
    };

    return (
        <div className="btn d-flex align-items-center justify-content-start border-0 border-bottom px-2 py-2 rounded-0"onClick={switchChatF}>
            <img src={img_url} alt="" className='logo' />
            <p className="h5 p-0 m-0 ms-3">{title}</p>
        </div>
    )
}

export default Dialogue;
