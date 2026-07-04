import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { API_URL } from '../config/api'

function CadastroObjeto() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('')
  const [descricao, setDescricao] = useState('')
  const [local, setLocal] = useState('')
  const [data, setData] = useState('')
  const [foto, setFoto] = useState(null)
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setCarregando(true)

    try {
      // Usando FormData para dar suporte ao upload do ficheiro binário da foto
      const formData = new FormData()
      formData.append('nome', nome)
      formData.append('categoria', categoria)
      formData.append('descricao', descricao)
      formData.append('local', local)
      formData.append('data', data)
      if (foto) {
        formData.append('foto', foto)
      }

      const response = await fetch(`${API_URL}/api/objetos`, {
        method: 'POST',
        body: formData, // O fetch infere automaticamente o header Content-Type como multipart/form-data
      })

      if (!response.ok) {
        throw new Error('Falha ao cadastrar o objeto. Verifique as informações fornecidas.')
      }

      alert('Objeto cadastrado com sucesso!')
      navigate({ to: '/objetos' })
    } catch (error) {
      alert(error.message)
    } finally {
      setCarregando(false)
    }
  }

  function handleFileChange(event) {
    if (event.target.files.length > 0) {
      setFoto(event.target.files[0])
    }
  }

  return (
    <section className="container" style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: '1.4rem' }}>Cadastrar Objeto Encontrado</h1>
      <p style={{ color: 'var(--color-muted)', marginTop: '-0.5rem' }}>Preencha os dados abaixo</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome do objeto</label>
          <input
            id="nome"
            type="text"
            placeholder="Ex: Carteira Preta"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="categoria">Categoria</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
            required
          >
            <option value="" disabled>Selecione uma categoria</option>
            <option value="documentos">Documentos</option>
            <option value="eletronicos">Eletrônicos</option>
            <option value="materiais">Materiais Escolares</option>
            <option value="vestuario">Vestuário</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        <div>
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            rows={4}
            placeholder="Descreva o objeto encontrado (características, marcas corporativas, cor)..."
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="local">Local encontrado</label>
            <input
              id="local"
              type="text"
              placeholder="Ex: Bloco A - Sala 104"
              value={local}
              onChange={(event) => setLocal(event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="data">Data encontrada</label>
            <input
              id="data"
              type="date"
              value={data}
              onChange={(event) => setData(event.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="foto">Foto do objeto</label>
          <label htmlFor="foto" className="dropzone" style={{ cursor: 'pointer' }}>
            {foto ? `Selecionado: ${foto.name}` : '📷 Clique para selecionar uma imagem'}
          </label>
          <input 
            id="foto" 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handleFileChange}
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={() => navigate({ to: '/objetos' })}
            disabled={carregando}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={carregando}>
            {carregando ? 'A salvar...' : 'Salvar'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default CadastroObjeto