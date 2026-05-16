import { useState } from "react";

function UsaHook(){
    /*//var nombre = "Juan";
    const [genero, setGenero]=useState("femenino");
    const[nombre, setNombre]= useState("Juan");
    const[flag, setFlag] = useState(false);
    const[fragmento, setFragmento] = useState(false);
    const [contador, setContador] = useState(0);

    const nombreMostrado = genero === "femenino" ? "Juana" : "Juan";
    
    return(
        <>
            {fragmento ? (
                <div>
                    <h1>{nombreMostrado}</h1>
                    <button onClick={()=>{
                        const nuevoGenero = genero === "femenino" ? "masculino" : "femenino";
                        setGenero(nuevoGenero);
                        console.log("Genero cambiado a: ", nuevoGenero);
                    }}>Cambiar género</button>
                    <p>{flag?"Afirmativo":"Negativo"}</p>
                </div>
            ) : (
                <h1>Nada que mostrar</h1>
            )}
            */

            const[contador, setContador] = useState(0);
            return(
                <div>
                    <h1>{contador}</h1>
                    <button onClick={()=>setContador(contador+1)}>Incrementar</button>
                    <button onClick={()=>setContador(contador-1)}>Decrementar</button>
                </div>
            );
}

export default UsaHook;