import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import SecureRoute from './components/SecureRoute'
import Login from './pages/Login'
import Home from './pages/Home'
import Filtrar from './pages/Filtrar'
import PokemonDetail from './pages/PokemonDetail'

export default function App() {
  return (
    <div className="app-container">
      {/* El Navbar ahora funciona como un panel lateral de control */}
      <Navbar />
      
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* AGRUPACIÓN: Home y Filtrar juntos en la pantalla principal */}
          <Route path="/home" element={
            <SecureRoute>
              <div className="dashboard-grid">
                <div className="dashboard-panel">
                  <h2 style={{color: '#ff00ff', marginBottom: '20px'}}>MÓDULO_ENTIDADES</h2>
                  <Home />
                </div>
                <div className="dashboard-panel">
                  <h2 style={{color: '#00ffcc', marginBottom: '20px'}}> MÓDULO_BÚSQUEDA</h2>
                  <Filtrar />
                </div>
              </div>
            </SecureRoute>
          } />
          
          <Route path="/filtrar" element={<SecureRoute><Filtrar /></SecureRoute>} />
          <Route path="/detalles/:id" element={<SecureRoute><PokemonDetail /></SecureRoute>} />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  )
}