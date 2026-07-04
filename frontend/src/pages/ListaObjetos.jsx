import { useEffect, useState } from 'react'
import { API_URL } from '../config/api'
import ItemCard from '../components/ItemCard'

function ListaObjetos() {
  const [objetos, setObjetos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

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

  return (
    <section className="container">
      <div className="section-heading">
        <h1 style={{ fontSize: '1.4rem' }}>Listagem de Objetos</h1>
      </div>

      <form className="search-bar" role="search" onSubmit={(event) => event.preventDefault()}>
        <input type="search" placeholder="Buscar objeto..." aria-label="Buscar objeto" />
        <button type="submit" className="btn btn-primary">
          Buscar
        </button>
      </form>

      <div className="filters-bar">
        <div>
          <label htmlFor="categoria">Categoria</label>
          <select id="categoria" defaultValue="">
            <option value="">Todas</option>
            <option value="documentos">Documentos</option>
            <option value="eletronicos">Eletrônicos</option>
            <option value="materiais">Materiais Escolares</option>
            <option value="vestuario">Vestuário</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select id="status" defaultValue="">
            <option value="">Todos</option>
            <option value="disponivel">Disponível</option>
            <option value="devolvido">Devolvido</option>
          </select>
        </div>
      </div>

      {carregando && <p>Carregando...</p>}
      {erro && <p role="alert">Não foi possível carregar os itens agora.</p>}
      {!carregando && !erro && objetos.length === 0 && (
        <p>Nenhum objeto cadastrado ainda.</p>
      )}

      <div className="item-grid">
        {objetos.map((objeto) => (
          <ItemCard key={objeto.id} objeto={objeto} />
        ))}
      </div>

      {objetos.length > 0 && (
        <nav className="pagination" aria-label="Paginação de resultados">
          <button type="button">‹</button>
          <button type="button" className="active">1</button>
          <button type="button">2</button>
          <button type="button">3</button>
          <button type="button">›</button>
        </nav>
      )}
    </section>
  )
}

export default ListaObjetos
