import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]

export default function Filtrar() {
  const [pokemon, setPokemon] = useState([])
  const [details, setDetails] = useState({})
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then(res => res.json())
      .then(async data => {
        setPokemon(data.results)
        const allDetails = await Promise.all(
          data.results.map(p => fetch(p.url).then(res => res.json()))
        )
        const detailMap = {}
        allDetails.forEach(d => { detailMap[d.name] = d })
        setDetails(detailMap)
      })
  }, [])

  const filtered = pokemon.filter(p => {
    const matchesName = p.name.toLowerCase().includes(search.toLowerCase())
    if (!selectedType) return matchesName
    const pDetails = details[p.name]
    if (!pDetails) return matchesName
    return matchesName && pDetails.types.some(t => t.type.name === selectedType)
  })

  return (
    <div className="filtrar-page">
      <div className="filter-controls" style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <input
          type="text"
          placeholder="> FILTRAR_POR_NOMBRE..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
          style={{ margin: 0 }}
        />
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="type-select"
          style={{ cursor: 'pointer' }}
        >
          <option value="">[ TODOS_LOS_TIPOS ]</option>
          {POKEMON_TYPES.map(t => (
            <option key={t} value={t}>{t.toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div className="pokemon-grid">
        {filtered.map(p => {
          const id = p.url.split('/').filter(Boolean).pop()
          return (
            <div
              key={p.name}
              className="pokemon-card"
              onClick={() => navigate(`/detalles/${id}`)}
            >
              <span style={{ fontSize: '0.8rem', color: '#666', display: 'block', textAlign: 'right' }}>
                ID_{id.padStart(3, '0')}
              </span>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                alt={p.name}
              />
              <p className="pokemon-name">{p.name}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}