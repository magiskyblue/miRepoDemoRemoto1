import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FEATURED_IDS = [25, 6, 150, 143, 94, 149]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all(
      FEATURED_IDS.map(id =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
      )
    ).then(setFeatured)
  }, [])

  return (
    <div className="home">
      <div style={{ marginBottom: '25px', padding: '15px', background: 'rgba(0, 255, 204, 0.02)', borderLeft: '3px solid #00ffcc' }}>
        <p style={{ color: '#00ffcc', fontSize: '1.1rem', letterSpacing: '1px' }}>
         ENTORNO_INICIALIZADO: Bienvenido a PokéApp. Explorando base de datos global...
        </p>
      </div>
      
      <section className="featured-section">
        <div className="pokemon-grid">
          {featured.map(p => (
            <div
              key={p.id}
              className="pokemon-card"
              onClick={() => navigate(`/detalles/${p.id}`)}
            >
              <span style={{ fontSize: '0.8rem', color: '#666', display: 'block', textAlign: 'right' }}>
                ID_{String(p.id).padStart(3, '0')}
              </span>
              <img
                src={p.sprites.other['official-artwork'].front_default}
                alt={p.name}
              />
              <p className="pokemon-name">{p.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}