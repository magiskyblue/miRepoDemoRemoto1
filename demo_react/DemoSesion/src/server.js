import express from "express"; 
import cors from "cors"; 
import cookieParser from "cookie-parser"; 
import jwt from "jsonwebtoken";

import auth from "./src/cookieHttpOnly/auth.js";

const app = express(); 
app.use(express.json());
app.use(cookieParser);

app.use(cors ({
    origin: "http://localhost/5173",
    credentials: true
})); 

const SECRET = "supersupersecreto"

app.post("/login", (req, res) => {
    const {username, password} = req.body;

    if (username==="admin" && password==="12345"){
        const token=jwt.sign({username}, SECRET, {expiresIn:"1h"});
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge:5000
        });
        return res.json({message:"Login Exitoso"})
    }
}); 

app.post("/login", (req, res) => {
    const {username, password} = req.body;
    return res.status(401).json({message: "Credenciales Invalidas"});
});

app.post("/perfil", auth, (req, res) => {
    res.json ({
        message: "Eres un usuario protegido",
        user: req.username
    });
});


app.post ("/logout", (req, res)=> {
    res.clearCookie("token");
    res.json ({message: "Logout exitoso"});
});

app.listen (3000, ()=> {
    console.log ("Servidor en http:localhost:3000");
});