import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { API_URL } from '../config/api'

// Verifica se o token existe e ainda não expirou
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

function ItemCardPerfil({ objeto }) {
  const categoriaNome = objeto.categoria.nome.toLowerCase();

  let catClass = "cat-outros";
  if (categoriaNome === "documentos") catClass = "cat-doc";
  else if (categoriaNome === "eletronicos") catClass = "cat-eletr";
  else if (categoriaNome === "materiais") catClass = "cat-mat";
  else if (categoriaNome === "vestuario") catClass = "cat-vest";

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
        <span className={`tag ${catClass}`}>{objeto.categoria.nome}</span>
        <span className="tag status-disp">Disponível</span>
        <Link to={`/objetos/${objeto.id}`} className="btn-detalhes">Ver Detalhes</Link>
      </div>
    </div>
  )
}

function Perfil() {
  const navigate = useNavigate()
  const [autorizado, setAutorizado] = useState(false)
  const [email, setEmail] = useState('')
  const [objetos, setObjetos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  // Proteção de rota: mesmo padrão usado em Painel.jsx e CadastroObjeto.jsx
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!tokenValido(token)) {
      localStorage.removeItem('token')
      localStorage.removeItem('email')
      navigate({ to: '/login' })
      return
    }
    setEmail(localStorage.getItem('email') || '')
    setAutorizado(true)
  }, [])

  useEffect(() => {
    if (!autorizado) return

    const token = localStorage.getItem('token')

    fetch(`${API_URL}/api/objetos/meus`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401 || response.status === 403) {
          throw new Error('SESSAO_EXPIRADA')
        }
        if (!response.ok) throw new Error('Falha ao buscar seus objetos')
        return response.json()
      })
      .then((dados) => {
        // Mostra apenas os objetos ainda não devolvidos
        setObjetos(dados.filter((obj) => obj.status === 'disponivel'))
      })
      .catch((error) => {
        if (error.message === 'SESSAO_EXPIRADA') {
          localStorage.removeItem('token')
          localStorage.removeItem('email')
          navigate({ to: '/login' })
          return
        }
        console.error(error)
        setErro('Não foi possível carregar seus objetos.')
      })
      .finally(() => setCarregando(false))
  }, [autorizado])

  if (!autorizado) return null

  return (
    <main className="container">
      <section className="panel-section" style={{ padding: '2rem 0' }}>
        <div className="section-header" style={{ marginBottom: '2rem' }}>
          <h2>Meu Perfil</h2>
          <p className="subtitle-left" style={{ color: 'gray', marginTop: '0.2rem' }}>
            {email}
          </p>
        </div>

        <div className="sec-header">
          <h3>Meus objetos perdidos ainda não encontrados</h3>
        </div>

        {carregando && (
          <p style={{ textAlign: 'center', margin: '20px 0' }}>Carregando seus registros...</p>
        )}

        {!carregando && erro && (
          <p style={{ textAlign: 'center', margin: '20px 0', color: 'red' }}>{erro}</p>
        )}

        {!carregando && !erro && objetos.length === 0 && (
          <p style={{ textAlign: 'center', margin: '20px 0' }}>
            Você não tem nenhum objeto pendente cadastrado.
          </p>
        )}

        {!carregando && !erro && objetos.length > 0 && (
          <div className="grid-objetos">
            {objetos.map((objeto) => (
              <ItemCardPerfil key={objeto.id} objeto={objeto} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Perfil
