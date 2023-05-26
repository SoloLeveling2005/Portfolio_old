import React, { useEffect, useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function Notification() {

    const [messages, setMessages] = useState<string[]>([]);
    const handleNewMessage = (message:string) => {
        setMessages(prevMessages => [...prevMessages, message]);
    };




    useEffect(() => {
        const timer = setInterval(() => {
            if (messages.length > 0) {
                setMessages(prevMessages => prevMessages.slice(1));
            }
        }, 5000);


        // Проверяем, зашел ли пользователь в приложение или регестрируется
        let user = localStorage.getItem('username')
        if (user === null) return

        const newSocket = new WebSocket(`ws://localhost:8000/ws/notifications/${localStorage.getItem('user_id')}`);

        newSocket.onopen = function (e) {
            console.log("[open] Соединение установлено");
            // Вдруг сообщество было создано только сейчас при соединении.
        };

        // Подписка на новые сообщения
        newSocket.onmessage = function (e) {
            let notification = JSON.parse(e.data);

            // handleNewMessage()

            console.log(notification);
        };

        newSocket.onclose = function (event) {
            if (event.wasClean) {
                alert(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
            } else {
                // например, сервер убил процесс или сеть недоступна
                // обычно в этом случае event.code 1006
                alert('[close] Соединение прервано');
            }
        };

        return () => {
            clearInterval(timer);
        };

    }, []);
    return (
        <section className={"notification-section"} id={"notification-section"}>
            {messages.map((item, index) => (
                <div key={index} className="alert alert-primary" role="alert">
                    {item}
                </div>
            ))}
        </section>
    );
}

export default Notification;
