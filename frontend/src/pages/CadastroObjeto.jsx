import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
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

function CadastroObjeto() {
  const navigate = useNavigate()
  const [autorizado, setAutorizado] = useState(false)
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('')
  const [local, setLocal] = useState('')
  const [data, setData] = useState('')
  const [foto, setFoto] = useState(null)
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

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

  const descricaoRef = useRef(null)
  const handleDescricao = (e) => {
    const value = e.target.value;
    if (value.length <= 600) {
      setDescricao(value);
    }
  };

  useEffect(() => {
    const el = descricaoRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight}px`
    }
  }, [descricao])

  const fileInputRef = useRef(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setEnviando(true)

    const token = localStorage.getItem('token')

    const formData = new FormData()
    formData.append('nome', nome)
    formData.append('categoria', categoria)
    formData.append('descricao', descricao)
    formData.append('local', local)
    formData.append('data', data)
    if (foto) {
      formData.append('foto', foto)
    }

    try {
      const response = await fetch(`${API_URL}/api/objetos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.status === 401 || response.status === 403) {
        setErro('Sua sessão expirou. Faça login novamente.')
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        navigate({ to: '/login' })
        return
      }

      if (!response.ok) {
        throw new Error('Não foi possível cadastrar o objeto. Tente novamente.')
      }

      alert("Objeto cadastrado com sucesso!")
      navigate({ to: '/objetos' })
    } catch (err) {
      console.error('Erro ao cadastrar objeto:', err)
      setErro(err.message || 'Erro ao conectar com o servidor.')
    } finally {
      setEnviando(false)
    }
  }

  function handleUploadClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  function handleFileChange(event) {
    if (event.target.files && event.target.files.length > 0) {
      setFoto(event.target.files[0])
    }
  }

  if (!autorizado) return null

  return (
    <main className="container page-flex-center">
      <div className="card-form block-max-width">
        <h2>Cadastrar Objeto Encontrado</h2>
        <p className="subtitle-left">Preencha os dados abaixo</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome-obj">Nome do objeto</label>
            <input 
              type="text" 
              id="nome-obj" 
              placeholder="Ex: Carteira Preta" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria-obj">Categoria</label>
            <select 
              id="categoria-obj" 
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="" disabled>Selecione uma categoria...</option>
              <option value="documentos">Documentos</option>
              <option value="eletronicos">Eletrônicos</option>
              <option value="materiais">Materiais Escolares</option>
              <option value="vestuario">Vestuário</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="desc-obj">Descrição</label>
            <textarea 
              id="desc-obj" 
              ref={descricaoRef}
              rows="4" 
              placeholder="Descreva o objeto encontrado... " 
              value={descricao}
              onChange={handleDescricao}
            ></textarea>
            <div className="char-counter">
              {descricao.length}/600
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="local-obj">Local encontrado</label>
              <input 
                type="text" 
                id="local-obj" 
                placeholder="Ex: Bloco A - Sala 104" 
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

          <div className="form-group">
            <label>Foto do objeto</label>
            <div className="upload-zone" id="uploadZone" onClick={handleUploadClick} style={{ cursor: 'pointer' }}>
              <i className="fa-solid fa-cloud-arrow-up"></i>
              <p>{foto ? `Arquivo: ${foto.name}` : 'Clique para selecionar uma imagem ou arraste e solte aqui'}</p>
              <input 
                type="file" 
                id="fileInput" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                hidden 
              />
            </div>
          </div>

          {erro && <p style={{ color: 'red', fontSize: '0.9rem' }}>{erro}</p>}

          <div className="form-actions-row">
            <Link to="/objetos" className="btn-cancelar">Cancelar</Link>
            <button type="submit" className="btn-salvar" disabled={enviando}>
              {enviando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default CadastroObjeto