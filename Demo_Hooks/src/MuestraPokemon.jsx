import { useEffect, useState } from "react"

export function MuestraPokemon() {
    const[pokemon, setPokemon] = useState(null);

    useEffect(
        ()=>{
            fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
                .then(res => res.json())
                .then(data => setPokemon(data));
            },[]
    );

    return pokemon ?<h1>{pokemon.name}</h1> : <h1>Cargando...</h1>
}
