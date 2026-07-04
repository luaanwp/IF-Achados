import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { API_URL } from '../config/api'
import ItemCard from '../components/ItemCard'

const CATEGORIAS = [
  { nome: 'Documentos', icone: '📄', slug: 'documentos' },
  { nome: 'Eletrônicos', icone: '📱', slug: 'eletronicos' },
  { nome: 'Materiais Escolares', icone: '✏️', slug: 'materiais' },
  { nome: 'Vestuário', icone: '👕', slug: 'vestuario' },
  { nome: 'Outros', icone: '⋯', slug: 'outros' },
]

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
    // Redireciona para a página de listagem injetando a query de busca nos parâmetros da URL
    navigate({
      to: '/objetos',
      search: { busca: busca || undefined }
    })
  }

  return (
    <>
      <section className="app-intro">
        <div className="container">
          <h1>Encontre o que você perdeu</h1>
          <p>Pesquise objetos encontrados no IFMA Campus Grajaú.</p>

          <form className="search-bar" role="search" onSubmit={handleSearch}>
            <input 
              type="search" 
              placeholder="Buscar objeto..." 
              aria-label="Buscar objeto" 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Buscar
            </button>
          </form>

          <div className="section-heading" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem' }}>Categorias</h2>
            <Link to="/objetos">Ver todas</Link>
          </div>

          <div className="category-grid">
            {CATEGORIAS.map((categoria) => (
              <button 
                key={categoria.nome} 
                type="button" 
                className="category-tile"
                onClick={() => navigate({ to: '/objetos', search: { categoria: categoria.slug } })}
              >
                <span className="category-tile-icon" aria-hidden="true">
                  {categoria.icone}
                </span>
                {categoria.nome}
              </button>
            ))}
          </div>

          <div className="section-heading" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem' }}>Objetos recentes encontrados</h2>
            <Link to="/objetos">Ver todos</Link>
          </div>

          {carregando && <p>A carregar itens recentes...</p>}
          {!carregando && objetos.length === 0 && (
            <p>Nenhum objeto cadastrado ainda no sistema.</p>
          )}

          <div className="item-grid">
            {objetos.map((objeto) => (
              <ItemCard key={objeto.id} objeto={objeto} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home