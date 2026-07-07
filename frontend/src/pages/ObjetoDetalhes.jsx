import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from '@tanstack/react-router'
import { API_URL } from '../config/api'

// Verifica se o token existe e ainda não expirou (mesma lógica das outras páginas)
function tokenValido(token) {
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiraEm = payload.exp * 1000
    return Date.now() < expiraEm
  } catch {
    return false
  }
}

function ObjetoDetalhes() {
  const { objetoId } = useParams({ strict: false })
  const navigate = useNavigate()
  const [objeto, setObjeto] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [atualizando, setAtualizando] = useState(false)

  // Página é pública (qualquer visitante pode ver detalhes), mas o botão de
  // "marcar como devolvido" só aparece se houver sessão válida
  const logado = tokenValido(localStorage.getItem('token'))

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


  // Marcar como devolvido — integrado de verdade com PATCH /api/objetos/{id}/devolvido
  async function handleMarcarDevolvido() {
    const token = localStorage.getItem('token')
    setAtualizando(true)

    try {
      const response = await fetch(`${API_URL}/api/objetos/${objetoId}/devolvido`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.status === 401 || response.status === 403) {
        alert('Sua sessão expirou. Faça login novamente.')
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        navigate({ to: '/login' })
        return
      }

      if (!response.ok) {
        throw new Error('Não foi possível atualizar o status do objeto.')
      }

      alert("Status do objeto atualizado para 'Devolvido' com sucesso!")
      navigate({ to: '/objetos' })
    } catch (error) {
      console.error('Erro ao marcar objeto como devolvido:', error)
      alert(error.message || 'Erro ao conectar com o servidor.')
    } finally {
      setAtualizando(false)
    }
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

  const isDisponivel = objeto.status !== 'devolvido'

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
            {isDisponivel && logado && (
              <button
                type="button"
                className="btn-salvar"
                onClick={handleMarcarDevolvido}
                disabled={atualizando}
                style={{ marginRight: '0.6rem' }}
              >
                {atualizando ? 'Atualizando...' : 'Marcar como devolvido'}
              </button>
            )}

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
