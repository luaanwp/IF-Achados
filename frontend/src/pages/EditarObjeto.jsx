import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from '@tanstack/react-router'
import { API_URL } from '../config/api'

// Verifica se o token existe e ainda não expirou (mesmo padrão das outras páginas)
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

function EditarObjeto() {
  const { objetoId } = useParams({ strict: false })
  const navigate = useNavigate()

  const [autorizado, setAutorizado] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [local, setLocal] = useState('')
  const [data, setData] = useState('')

  // Dados que o PUT atual não processa — mostrados só como referência, não editáveis
  const [categoriaNome, setCategoriaNome] = useState('')
  const [fotoUrl, setFotoUrl] = useState('')

  // Proteção de rota: editar exige login, igual Painel/CadastroObjeto
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!tokenValido(token)) {
      localStorage.removeItem('token')
      localStorage.removeItem('email')
      navigate({ to: '/login' })
      return
    }
    setAutorizado(true)
  }, [])

  // Carrega os dados atuais do objeto pra pré-preencher o formulário
  useEffect(() => {
    if (!autorizado) return

    fetch(`${API_URL}/api/objetos/${objetoId}`)
      .then((response) => {
        if (!response.ok) throw new Error('Não foi possível carregar este objeto.')
        return response.json()
      })
      .then((objeto) => {
        setNome(objeto.nome || '')
        setDescricao(objeto.descricao || '')
        setLocal(objeto.local || '')
        setData(objeto.data || '')
        setCategoriaNome(objeto.categoria?.nome || '')
        setFotoUrl(objeto.fotoUrl || '')
      })
      .catch((error) => {
        console.error(error)
        setErro(error.message)
      })
      .finally(() => setCarregando(false))
  }, [autorizado, objetoId])

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setSalvando(true)

    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${API_URL}/api/objetos/${objetoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, descricao, local, data }),
      })

      if (response.status === 401 || response.status === 403) {
        setErro('Sua sessão expirou. Faça login novamente.')
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        navigate({ to: '/login' })
        return
      }

      if (!response.ok) {
        throw new Error('Não foi possível salvar as alterações. Tente novamente.')
      }

      alert('Objeto atualizado com sucesso!')
      navigate({ to: '/painel' })
    } catch (error) {
      console.error('Erro ao atualizar objeto:', error)
      setErro(error.message || 'Erro ao conectar com o servidor.')
    } finally {
      setSalvando(false)
    }
  }

  if (!autorizado) return null
  if (carregando) return <main className="container"><p>Carregando objeto...</p></main>

  return (
    <main className="container page-flex-center">
      <div className="card-form block-max-width">
        <h2>Editar Objeto</h2>
        <p className="subtitle-left">Atualize os dados do objeto</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome-obj">Nome do objeto</label>
            <input
              type="text"
              id="nome-obj"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          {/* Categoria não é editável hoje — o backend ainda não processa troca de categoria no PUT */}
          <div className="form-group">
            <label>Categoria (não editável por aqui)</label>
            <input type="text" value={categoriaNome} disabled />
          </div>

          <div className="form-group">
            <label htmlFor="desc-obj">Descrição</label>
            <textarea
              id="desc-obj"
              rows="4"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            ></textarea>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="local-obj">Local encontrado</label>
              <input
                type="text"
                id="local-obj"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="data-obj">Data encontrada</label>
              <input
                type="date"
                id="data-obj"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Foto também não é editável hoje — mostrada só como referência */}
          {fotoUrl && (
            <div className="form-group">
              <label>Foto atual (não editável por aqui)</label>
              <div className="img-placeholder" style={{ maxWidth: '200px', height: '150px' }}>
                <img
                  src={fotoUrl}
                  alt={nome}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          )}

          {erro && <p style={{ color: 'red', fontSize: '0.9rem' }}>{erro}</p>}

          <div className="form-actions-row">
            <Link to="/painel" className="btn-cancelar">Cancelar</Link>
            <button type="submit" className="btn-salvar" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default EditarObjeto
