const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3001;

// Memoria temporal (NO persistente)
let messages = [];

app.use(express.json());
app.use(cookieParser());

// Configurar CORS para permitir cookies
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

// Middleware para manejar sesión simple con cookie httpOnly
app.use((req, res, next) => {
    if (!req.cookies.userId) {
        const userId = uuidv4();
        res.cookie("userId", userId, {
            httpOnly: true
        });
        req.userId = userId;
    } else {
        req.userId = req.cookies.userId;
    }
    next();
});

// Obtener mensajes
app.get("/messages", (req, res) => {
    res.json(messages);
});

// Enviar mensaje
app.post("/messages", (req, res) => {
    const { text } = req.body;

    const message = {
        id: uuidv4(),
        user: req.userId,
        text
    };

    messages.push(message);
    res.json(message);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});