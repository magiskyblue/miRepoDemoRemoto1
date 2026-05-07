const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");

const http = require("http");
const { Server } = require("socket.io");

const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

const app = express();
const PORT = 4000;

const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});

// Memoria temporal
let messages = [];

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "*",
    credentials: true
}));

// Cookie httpOnly
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

// SOCKETS
io.on("connection", (socket) => {

    console.log("Usuario conectado");

    // Escuchar mensaje
    socket.on("sendMessage", (data) => {

        const message = {
            id: uuidv4(),
            text: data.text
        };

        messages.push(message);

        // Enviar a TODOS
        io.emit("newMessage", message);
    });

    socket.on("disconnect", () => {
        console.log("Usuario desconectado");
    });
});

// REDIS
async function startRedis() {

    const pubClient = createClient({
        url: "redis://localhost:6379"
    });

    const subClient = pubClient.duplicate();

    await pubClient.connect();
    await subClient.connect();

    io.adapter(createAdapter(pubClient, subClient));

    console.log("Redis conectado");
}

startRedis();

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});