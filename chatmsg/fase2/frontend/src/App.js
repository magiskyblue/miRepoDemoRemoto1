import './App.css';

import { useEffect, useState } from 'react';

import { io } from 'socket.io-client';

// CAMBIA ESTA IP POR TU IP LOCAL
const socket = io("http://192.168.8.45:4000", {
  withCredentials: true
});

function App() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {

    socket.on("newMessage", (data) => {

      setMessages((prev) => [...prev, data]);

    });

    return () => {
      socket.off("newMessage");
    };

  }, []);

  const sendMessage = () => {

    if (message.trim() === "") return;

    socket.emit("sendMessage", {
      text: message
    });

    setMessage("");
  };

  return (

    <div className="App">

      <h1>ChatMSG Fase 2</h1>

      <div className="chat-box">

        {messages.map((msg) => (

          <div className="message" key={msg.id}>
            {msg.text}
          </div>

        ))}

      </div>

      <div className="input-area">

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje"
        />

        <button onClick={sendMessage}>
          Enviar
        </button>

      </div>

    </div>
  );
}

export default App;