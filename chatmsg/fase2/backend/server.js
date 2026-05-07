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

// ID del servidor
const SERVER_ID = process.env.SERVER_ID || "server";

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

// Cookies httpOnly
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

    console.log(`[${SERVER_ID}] Usuario conectado`);

    // Enviar historial al conectar
    socket.emit("chat_history", messages);

    // Escuchar mensajes enviados desde frontend
    socket.on("send_message", (data) => {

        const message = {
            id: uuidv4(),
            user: data.user,
            text: data.text,
            time: new Date().toLocaleTimeString(),
            server: SERVER_ID
        };

        // Guardar mensaje
        messages.push(message);

        console.log(`[${SERVER_ID}] Mensaje recibido: ${message.text}`);

        // Enviar mensaje a todos
        io.emit("receive_message", message);

    });

    socket.on("disconnect", () => {
        console.log(`[${SERVER_ID}] Usuario desconectado`);
    });

});

// REDIS CLOUD
async function startRedis() {

    const pubClient = createClient({

        username: process.env.REDIS_USERNAME,

        password: process.env.REDIS_PASSWORD,

        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        }

    });

    const subClient = pubClient.duplicate();

    await pubClient.connect();
    await subClient.connect();

    io.adapter(createAdapter(pubClient, subClient));

    console.log(`[${SERVER_ID}] Redis Cloud conectado`);
}

startRedis();

server.listen(PORT, "0.0.0.0", () => {
    console.log(`[${SERVER_ID}] Servidor corriendo en puerto ${PORT}`);
});