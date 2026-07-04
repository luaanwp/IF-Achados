import { Link } from '@tanstack/react-router'

const STATUS_LABEL = {
  disponivel: 'Disponível',
  devolvido: 'Devolvido',
}

function ItemCard({ objeto }) {
  const status = objeto.status ?? 'disponivel'

  return (
    <article className="item-card">
      <div className="item-card-thumb" aria-hidden="true">
        {/* placeholder ate o upload de imagem estar pronto */}
        🖼️
      </div>
      <div className="item-card-body">
        <span className="item-card-name">{objeto.nome}</span>
        <span className="item-card-category">{objeto.categoria}</span>
        <span className={`badge ${status === 'devolvido' ? 'badge-devolvido' : 'badge-disponivel'}`}>
          {STATUS_LABEL[status] ?? status}
        </span>
        <div className="item-card-actions">
          <Link to="/objetos/$objetoId" params={{ objetoId: objeto.id }} className="btn btn-outline btn-sm btn-block">
            Ver Detalhes
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ItemCard
