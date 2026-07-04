import { useEffect, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { API_URL } from '../config/api'

const STATUS_LABEL = {
  disponivel: 'Disponível',
  devolvido: 'Devolvido',
}

function ObjetoDetalhes() {
  const { objetoId } = useParams({ strict: false })
  const [objeto, setObjeto] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/api/objetos/${objetoId}`)
      .then((response) => {
        if (!response.ok) throw new Error('Falha ao buscar objeto')
        return response.json()
      })
      .then(setObjeto)
      .catch(setErro)
      .finally(() => setCarregando(false))
  }, [objetoId])

  return (
    <section className="container">
      <Link to="/objetos" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
        ← Voltar
      </Link>

      {carregando && <p>Carregando...</p>}
      {erro && <p role="alert">Não foi possível carregar este item.</p>}

      {objeto && (
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
          <div className="item-card-thumb" style={{ borderRadius: 'var(--radius-md)' }} aria-hidden="true">
            🖼️
          </div>

          <div>
            <h1>{objeto.nome}</h1>

            <p>
              <strong>Categoria:</strong> <span className="item-card-category">{objeto.categoria}</span>
            </p>
            <p>
              <strong>Descrição:</strong>
              <br />
              {objeto.descricao}
            </p>
            <p>
              <strong>Local encontrado:</strong>
              <br />
              {objeto.local}
            </p>
            <p>
              <strong>Data do registro:</strong>
              <br />
              {objeto.data}
            </p>
            <p>
              <strong>Status:</strong>
              <br />
              <span className={`badge ${objeto.status === 'devolvido' ? 'badge-devolvido' : 'badge-disponivel'}`}>
                {STATUS_LABEL[objeto.status] ?? objeto.status}
              </span>
            </p>

            <div className="form-actions">
              <Link to="/objetos" className="btn btn-outline">
                Voltar
              </Link>
              <button type="button" className="btn btn-danger">
                Marcar como Devolvido
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ObjetoDetalhes
