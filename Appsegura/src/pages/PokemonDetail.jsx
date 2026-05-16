import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function PokemonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pokemon, setPokemon] = useState(null)

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(res => res.json())
      .then(setPokemon)
  }, [id])

  if (!pokemon) return <div className="loading-glitch"> EXTRACCIÓN_DE_NODO_EN_PROGRESO...</div>

  return (
    <div className="pokemon-detail" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(-1)} 
        className="btn-back"
        style={{ background: 'transparent', border: '1px solid #00ffcc', color: '#00ffcc', padding: '8px 20px', cursor: 'pointer', marginBottom: '20px' }}
      >
        [ &lt;-- VOLVER_AL_PANEL ]
      </button>
      
      <div className="detail-card" style={{ background: 'rgba(10, 10, 15, 0.9)', border: '1px solid #333', padding: '30px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, #ff00ff, #00ffcc)' }}></div>
        
        <img
          src={pokemon.sprites.other['official-artwork'].front_default}
          alt={pokemon.name}
          style={{ width: '200px', height: '200px', filter: 'drop-shadow(0 0 15px rgba(0,255,204,0.3))', display: 'block', margin: '0 auto' }}
        />
        
        <h1 style={{ textAlign: 'center', color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '15px' }}>
          {pokemon.name} <span style={{ color: '#666' }}># {String(pokemon.id).padStart(3, '0')}</span>
        </h1>
        
        <div className="types" style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0' }}>
          {pokemon.types.map(t => (
            <span key={t.type.name} style={{ border: '1px solid #fff', padding: '4px 12px', fontSize: '0.8rem', textTransform: 'uppercase', color: '#fff' }}>
              {t.type.name}
            </span>
          ))}
        </div>

        <div className="stats" style={{ marginTop: '30px' }}>
          <h2 style={{ color: '#ff00ff', fontSize: '1.2rem', marginBottom: '15px', borderBottom: '1px dashed #333', paddingBottom: '5px' }}>
             METRICAS_DE_ENTIDAD_BASE:
          </h2>
          {pokemon.stats.map(s => (
            <div key={s.stat.name} className="stat-row" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
              <span className="stat-name" style={{ width: '140px', color: '#aaa', textTransform: 'uppercase', fontSize: '0.9rem' }}>{s.stat.name}</span>
              <div className="stat-bar-bg" style={{ flex: 1, height: '8px', background: '#222' }}>
                <div
                  className="stat-bar-fill"
                  style={{ width: `${(s.base_stat / 255) * 100}%`, height: '100%', background: '#00ffcc', boxShadow: '0 0 8px #00ffcc' }}
                />
              </div>
              <span className="stat-value" style={{ width: '45px', textAlign: 'right', color: '#00ffcc', fontWeight: 'bold' }}>{s.base_stat}</span>
            </div>
          ))}
        </div>

        <div className="info" style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '30px', borderTop: '1px dashed #333', paddingTop: '15px', color: '#aaa' }}>
          <p><strong>ALTURA:</strong> {pokemon.height / 10} M</p>
          <p><strong>PESO:</strong> {pokemon.weight / 10} KG</p>
        </div>
      </div>
    </div>
  )
}