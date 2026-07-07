import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from '@tanstack/react-router'
import { API_URL } from '../config/api'

function ObjetoDetalhes() {
  const { objetoId } = useParams({ strict: false })
  const navigate = useNavigate()
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
      .catch((error) => {
    console.error(error)
    setErro(error.message)
    })
      .finally(() => setCarregando(false))
  }, [objetoId]) 


  // Função baseada no script.js novo (Marcar como devolvido)
  const handleMarcarDevolvido = () => {
    // Aqui você no futuro fará um PUT ou PATCH na API
    alert("Status do objeto atualizado para 'Devolvido' com sucesso!");
    navigate({ to: '/objetos' });
  }

  if (carregando) return <main className="container"><p>Carregando detalhes do objeto...</p></main>
  if (erro) return <main className="container"><p role="alert">Não foi possível carregar este item.</p></main>
  if (!objeto) return null;
  let categoriaClass = 'cat-outros'
  const categoriaNome = objeto.categoria.nome.toLowerCase()

if (categoriaNome === 'documentos')
  categoriaClass = 'cat-doc'
else if (categoriaNome === 'eletronicos')
  categoriaClass = 'cat-eletr'
else if (categoriaNome === 'materiais')
  categoriaClass = 'cat-mat'
else if (categoriaNome === 'vestuario')
  categoriaClass = 'cat-vest'
const dataFormatada = objeto?.data
  ? new Date(objeto.data).toLocaleString('pt-BR')
  : ''
  return (
    <main className="container">
      <div className="back-link-wrapper">
        <Link to="/objetos" className="btn-back">
          <i className="fa-solid fa-arrow-left"></i> Voltar
        </Link>
      </div>

      <section className="details-card">
        <div className="details-image-side">
          <div className="img-large-placeholder">
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
        </div>
        <div className="details-info-side">
          <h2>{objeto.nome}</h2>
          
          <div className="info-group-item">
            <span className="label">Categoria:</span>
            {/* Lógica simples para mudar a cor da tag baseado na categoria se quiser */}
              <span className={`tag ${categoriaClass} font-md`}>
                {objeto.categoria.nome}
              </span>
          </div>

          <div className="info-group-item">
            <span className="label">Descrição:</span>
            <p className="description-text">{objeto.descricao}</p>
          </div>

          <div className="info-group-item">
            <span className="label">Local encontrado:</span>
            <p className="data-text">{objeto.local}</p>
          </div>

          <div className="info-group-item">
            <span className="label">Data do registro:</span>
            <p className="data-text">{dataFormatada}</p>
          </div>

          <div className="info-group-item">
            <span className="label">Status:</span>
            <span className={`tag font-md ${objeto.status === 'devolvido' ? 'status-dev' : 'status-disp'}`}>
              {objeto.status === 'devolvido' ? 'Devolvido' : 'Disponível'}
            </span>
          </div>

          <div className="details-actions">
            <button
              type="button"
                className="btn-secondary"
                onClick={() => window.history.back()}
              >
                Voltar
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ObjetoDetalhes