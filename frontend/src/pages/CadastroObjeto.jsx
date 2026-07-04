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

  function handleSubmit(event) {
    event.preventDefault()
    // TODO: integrar com POST {API_URL}/api/objetos (multipart, se incluir a foto)
    console.log('novo objeto', { nome, categoria, descricao, local, data, API_URL })
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
            <option value="">Selecione uma categoria</option>
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
            rows={3}
            placeholder="Descreva o objeto encontrado..."
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
          <label htmlFor="foto" className="dropzone">
            📷 Clique para selecionar uma imagem ou arraste e solte aqui
          </label>
          <input id="foto" type="file" accept="image/*" style={{ display: 'none' }} />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate({ to: '/objetos' })}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Salvar
          </button>
        </div>
      </form>
    </section>
  )
}

export default CadastroObjeto
