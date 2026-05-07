import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:4000";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(`${API}/messages`, { withCredentials: true })
        .then(res => setMessages(res.data))
        .catch(err => console.error(err));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!text) return;

    const res = await axios.post(`${API}/messages`,
      { text },
      { withCredentials: true }
    );

    setMessages(prev => [...prev, res.data]);
    setText("");
  };

  return (
    <div>
      <h1>ChatMSG - Fase 1</h1>

      <div style={{ border: "1px solid black", height: "300px", overflow: "auto" }}>
        {messages.map(msg => (
          <div key={msg.id}>
            <b>{msg.user ? msg.user.substring(0,5) : "user"}:</b> {msg.text}
          </div>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe mensaje..."
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}

export default App;