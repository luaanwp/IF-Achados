import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { API_URL } from '../config/api'

// O componente de Card que ficava separado ou dentro do arquivo
function ItemCard({ objeto }) {
  const isDisponivel = objeto.status !== 'devolvido';

  return (
    <div className="obj-card">
      <div className="img-placeholder"><i className="fa-regular fa-image"></i></div>
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
    <main className="container">
      <section className="filter-wrapper">
        <form className="search-bar inline" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Buscar objeto..." />
          <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
        </form>
        
        <div className="select-filters">
          <select id="filtro-categoria" defaultValue="">
            <option value="">Categoria: Todas</option>
            <option value="documentos">Documentos</option>
            <option value="eletronicos">Eletrônicos</option>
            <option value="materiais">Materiais Escolares</option>
            <option value="vestuario">Vestuário</option>
            <option value="outros">Outros</option>
          </select>
          
          <select id="filtro-status" defaultValue="">
            <option value="">Status: Todos</option>
            <option value="disponivel">Disponível</option>
            <option value="devolvido">Devolvido</option>
          </select>
        </div>
      </section>

      {carregando && <p style={{textAlign: 'center', marginTop: '20px'}}>Carregando...</p>}
      {erro && <p role="alert" style={{color: 'red', textAlign: 'center', marginTop: '20px'}}>Não foi possível carregar os itens agora.</p>}
      {!carregando && !erro && objetos.length === 0 && (
        <p style={{textAlign: 'center', marginTop: '20px'}}>Nenhum objeto cadastrado ainda.</p>
      )}

      <section className="objects-grid">
        {objetos.map((objeto) => (
          <ItemCard key={objeto.id} objeto={objeto} />
        ))}
      </section>

      {objetos.length > 0 && (
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