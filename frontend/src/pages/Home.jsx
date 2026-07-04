import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { API_URL } from '../config/api'

// Criamos o componente do Card igualzinho ao seu HTML
function ItemCard({ objeto }) {
  const isDisponivel = objeto.status !== 'devolvido';
  
  // Definindo a cor da tag baseado na categoria
  let catClass = "cat-outros";
  if (objeto.categoria === "documentos") catClass = "cat-doc";
  else if (objeto.categoria === "eletronicos") catClass = "cat-eletr";
  else if (objeto.categoria === "materiais") catClass = "cat-mat";
  else if (objeto.categoria === "vestuario") catClass = "cat-vest";

  return (
    <div className="obj-card">
      <div className="img-placeholder"><i className="fa-regular fa-image"></i></div>
      <div className="obj-info">
        <h4>{objeto.nome}</h4>
        <span className={`tag ${catClass}`}>{objeto.categoria}</span>
        <span className={`tag ${isDisponivel ? 'status-disp' : 'status-dev'}`}>
          {isDisponivel ? 'Disponível' : 'Devolvido'}
        </span>
        <Link to={`/objetos/${objeto.id}`} className="btn-detalhes">Ver Detalhes</Link>
      </div>
    </div>
  )
}

function Home() {
  const [objetos, setObjetos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_URL}/api/objetos`)
      .then((response) => {
        if (!response.ok) throw new Error('Falha ao buscar objetos')
        return response.json()
      })
      .then((dados) => setObjetos(dados.slice(0, 4))) // Exibe apenas os 4 mais recentes
      .catch(() => setObjetos([]))
      .finally(() => setCarregando(false))
  }, [])

  function handleSearch(event) {
    event.preventDefault()
    navigate({
      to: '/objetos',
      search: { busca: busca || undefined }
    })
  }

  return (
    <main className="container">
      {/* Seção do Banner Principal */}
      <section className="hero">
        <h1>Encontre o que você perdeu</h1>
        <p>Pesquise objetos encontrados no IFMA Campus Grajaú.</p>
        <form onSubmit={handleSearch} className="search-bar">
          <input 
            type="text" 
            name="busca" 
            placeholder="Buscar objeto..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
        </form>
      </section>

      {/* Seção de Últimos Registros */}
      <section className="recent-objects">
        <div className="section-header">
          <h2>Últimos Registros</h2>
          <Link to="/objetos" className="link-more">
            Ver todos <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
        
        {carregando && <p style={{textAlign: 'center', margin: '20px 0'}}>Carregando registros...</p>}
        {!carregando && objetos.length === 0 && (
          <p style={{textAlign: 'center', margin: '20px 0'}}>Nenhum objeto cadastrado ainda.</p>
        )}

        {/* Grid de Objetos */}
        <div className="objects-grid">
          {objetos.map((objeto) => (
            <ItemCard key={objeto.id} objeto={objeto} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home