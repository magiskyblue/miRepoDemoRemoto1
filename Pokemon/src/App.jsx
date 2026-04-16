import PokemonList from "./components/PokemonList";
import "./App.css";

function App() {
  const pokemons = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Pokemon ${i + 1}`,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png`,
    type: ["Grass", "Fire", "Water", "Electric"][i % 4],
    description: "Este es un Pokémon increíble con habilidades únicas.",
    stats: {
      hp: Math.floor(Math.random() * 100),
      attack: Math.floor(Math.random() * 100),
      defense: Math.floor(Math.random() * 100),
    },
  }));

  return (
    <>
      <h1>Pokédex</h1>
      <PokemonList pokemons={pokemons} />
    </>
  );
}

export default App;