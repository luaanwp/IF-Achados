import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { API_URL } from '../config/api'
import ItemCard from '../components/ItemCard'

const CATEGORIAS = [
  { nome: 'Documentos', icone: '📄' },
  { nome: 'Eletrônicos', icone: '📱' },
  { nome: 'Materiais Escolares', icone: '✏️' },
  { nome: 'Vestuário', icone: '👕' },
  { nome: 'Outros', icone: '⋯' },
]

function Home() {
  const [objetos, setObjetos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/objetos`)
      .then((response) => {
        if (!response.ok) throw new Error('Falha ao buscar objetos')
        return response.json()
      })
      .then((dados) => setObjetos(dados.slice(0, 4)))
      .catch(() => setObjetos([]))
      .finally(() => setCarregando(false))
  }, [])

  return (
    <>
      <section className="app-intro">
        <div className="container">
          <h1>Encontre o que você perdeu</h1>
          <p>Pesquise objetos encontrados no IFMA Campus Grajaú.</p>

          <form className="search-bar" role="search" onSubmit={(event) => event.preventDefault()}>
            <input type="search" placeholder="Buscar objeto..." aria-label="Buscar objeto" />
            <button type="submit" className="btn btn-primary">
              Buscar
            </button>
          </form>

          <div className="section-heading" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem' }}>Categorias</h2>
            <a href="#categorias">Ver todas</a>
          </div>

          <div className="category-grid">
            {CATEGORIAS.map((categoria) => (
              <button key={categoria.nome} type="button" className="category-tile">
                <span className="category-tile-icon" aria-hidden="true">
                  {categoria.icone}
                </span>
                {categoria.nome}
              </button>
            ))}
          </div>

          <div className="section-heading">
            <h2 style={{ fontSize: '1.1rem' }}>Objetos encontrados</h2>
            <Link to="/objetos">Ver todos</Link>
          </div>

          {carregando && <p>Carregando...</p>}
          {!carregando && objetos.length === 0 && (
            <p>Nenhum objeto cadastrado ainda. Assim que a API estiver populada, eles aparecem aqui.</p>
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
