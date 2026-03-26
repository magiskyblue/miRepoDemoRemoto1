const express = require ("express"); 
const cors = require ("cors"); 
const mongoose = require("mongoose"); 

const Usuario = require ("./models/Usuario")


const app = express(); 
const port = 3000; 

app.use(cors()); 
app.use(express.json()); 
app.use(express.static("public")); 

mongoose.connect("mongodb://magali:Valoryan999@ac-jvpoc2s-shard-00-00.vzjdprz.mongodb.net:27017,ac-jvpoc2s-shard-00-01.vzjdprz.mongodb.net:27017,ac-jvpoc2s-shard-00-02.vzjdprz.mongodb.net:27017/GrupoA?ssl=true&replicaSet=atlas-ib6t1e-shard-0&authSource=admin&appName=Cluster0")
  .then(() => console.log("MongoDB Ready! ✅"))
  .catch(err => console.error("Error de conexión:", err));

app.post("/api/usuarios", async(req, res)=>{
    const nuevo =new Usuario (
        {
            nombre: req.body.nombre,
            email: req.body.email,
            genero: req.body.genero, 
            plataforma: req.body.plataformas
        }
    )
    const guardado = await nuevo.save(); 
    res.json(guardado); 
});

app.get("/api/usuarios", async (req, res)=>{
    const usuarios= await Usuario.find();
    res.json(usuarios);  
});

app.put('/api/usuarios/:id', async (req, res) => {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
        req.params.id,
        {
            nombre: req.body.nombre,
            email: req.body.email,
            genero: req.body.genero,
            plataformas: req.body.plataformas
        },
        {new: true}
    );

    res.json(usuarioActualizado);
});


app.listen(port,()=>{console.log("Ya está funcionando el servidor")});