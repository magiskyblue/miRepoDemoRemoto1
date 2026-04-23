import { useState } from "react";


export default function AppCookieHttpOnly() {
    const [username, setUsername] = useState("admin"); 
    const [password, setPassword] = useState("12345");
    const [mensaje, setMensaje] = useState(""); 
    
    
  const login = async (e) => {
    const res = await fetch("http://localhost:3000/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
  };



  const logout = async () => {
    const res = await fetch ("http://localhost:3000/logout", {
        credentials: "include"
    })

    const data= await res.json();
    setMensaje(data.message);
  }

  return(
    <div> 
        <h2> Autenticacion con Cookie Segura </h2>

        <input
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
        placeholder="Username"
        />

         <input
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        placeholder="Password"
        />

    </div>
    
  );



}