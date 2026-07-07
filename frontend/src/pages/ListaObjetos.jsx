import { useEffect, useState } from 'react'
import { Link, useSearch } from '@tanstack/react-router'
import { API_URL } from '../config/api'

// O componente de Card que ficava separado ou dentro do arquivo
function ItemCard({ objeto }) {
  const isDisponivel = objeto.status !== 'devolvido';

  return (
    <div className="obj-card">
      <div className="img-placeholder">
        {objeto.fotoUrl ? (
          <img
            src={objeto.fotoUrl}
            alt={objeto.nome}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <i className="fa-regular fa-image"></i>
        )}
      </div>
      <div className="obj-info">
        <h4>{objeto.nome}</h4>
        <span className="tag cat-outros">{objeto.categoria.nome}</span>
        <span className={`tag ${isDisponivel ? 'status-disp' : 'status-dev'}`}>
          {isDisponivel ? 'Disponível' : 'Devolvido'}
        </span>
        {/* Passando o ID na URL para o detalhe */}
        <Link to={`/objetos/${objeto.id}`} className="btn-detalhes">Ver Detalhes</Link>
      </div>
    </div>
  )
}

function ListaObjetos() {
  const [objetos, setObjetos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const search = useSearch({ strict: false })

  // Estado dos filtros — inicializado a partir da URL (ex: vindo dos cards de
  // categoria da Home, que já mandam ?categoria=documentos, ou da busca do hero)
  const [busca, setBusca] = useState(search.busca || '')
  const [categoria, setCategoria] = useState(search.categoria || '')
  const [status, setStatus] = useState('')

  // Se a pessoa navegar de novo pra essa página com outro filtro na URL
  // (ex: clicou em outro card de categoria na Home), sincroniza os campos
  useEffect(() => {
    setBusca(search.busca || '')
    setCategoria(search.categoria || '')
  }, [search.busca, search.categoria])

  useEffect(() => {
    fetch(`${API_URL}/api/objetos`)
      .then((response) => {
        if (!response.ok) throw new Error('Falha ao buscar objetos')
        return response.json()
      })
      .then(setObjetos)
      .catch(setErro)
      .finally(() => setCarregando(false))
  }, [])

  // Filtro aplicado sobre a lista já carregada — busca por nome (parcial,
  // sem diferenciar maiúsculas/minúsculas) + categoria exata + status exato
  const objetosFiltrados = objetos.filter((objeto) => {
    const nomeCategoria = objeto.categoria?.nome?.toLowerCase() || ''

    if (categoria && nomeCategoria !== categoria) return false
    if (status && objeto.status !== status) return false
    if (busca && !objeto.nome.toLowerCase().includes(busca.toLowerCase())) return false

    return true
  })

  return (
    <main className="container">
      <section className="filter-wrapper">
        <form className="search-bar inline" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Buscar objeto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
        </form>

        <div className="select-filters">
          <select
            id="filtro-categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Categoria: Todas</option>
            <option value="documentos">Documentos</option>
            <option value="eletronicos">Eletrônicos</option>
            <option value="materiais">Materiais Escolares</option>
            <option value="vestuario">Vestuário</option>
            <option value="outros">Outros</option>
          </select>

          <select
            id="filtro-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Status: Todos</option>
            <option value="disponivel">Disponível</option>
            <option value="devolvido">Devolvido</option>
          </select>
        </div>
      </section>

      {carregando && <p style={{textAlign: 'center', marginTop: '20px'}}>Carregando...</p>}
      {erro && <p role="alert" style={{color: 'red', textAlign: 'center', marginTop: '20px'}}>Não foi possível carregar os itens agora.</p>}
      {!carregando && !erro && objetosFiltrados.length === 0 && (
        <p style={{textAlign: 'center', marginTop: '20px'}}>
          {objetos.length === 0 ? 'Nenhum objeto cadastrado ainda.' : 'Nenhum objeto encontrado com esses filtros.'}
        </p>
      )}

      <section className="objects-grid">
        {objetosFiltrados.map((objeto) => (
          <ItemCard key={objeto.id} objeto={objeto} />
        ))}
      </section>

      {objetosFiltrados.length > 0 && (
        <div className="pagination">
          <button className="btn-pag page-control"><i className="fa-solid fa-chevron-left"></i></button>
          <button className="btn-pag active">1</button>
          <button className="btn-pag">2</button>
          <button className="btn-pag page-control"><i className="fa-solid fa-chevron-right"></i></button>
        </div>
      )}
    </main>
  )
}

export default ListaObjetos
