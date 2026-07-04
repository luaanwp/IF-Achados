import { useState, useRef } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { API_URL } from '../config/api'

function CadastroObjeto() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('')
  const [descricao, setDescricao] = useState('')
  const [local, setLocal] = useState('')
  const [data, setData] = useState('')
  const [foto, setFoto] = useState(null)
  
  // Referência para o input de arquivo oculto
  const fileInputRef = useRef(null)

  function handleSubmit(event) {
    event.preventDefault()
    // TODO: integrar com POST {API_URL}/api/objetos
    console.log('novo objeto', { nome, categoria, descricao, local, data, foto, API_URL })
    
    // Simula o salvamento e volta para a tela de listagem (ou painel)
    alert("Objeto cadastrado com sucesso!")
    navigate({ to: '/objetos' })
  }

  // Função para simular o clique no input file quando clicar na zona de upload
  function handleUploadClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Função para guardar o arquivo selecionado no estado do React
  function handleFileChange(event) {
    if (event.target.files && event.target.files.length > 0) {
      setFoto(event.target.files[0])
    }
  }

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
              rows="4" 
              placeholder="Descreva o objeto encontrado... " 
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            ></textarea>
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
              {/* Mudei o type para "date" para facilitar a seleção no navegador */}
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
              {/* O texto muda dinamicamente se o usuário selecionar uma foto */}
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

          <div className="form-actions-row">
            {/* O Link do React Router substitui a tag <a> padrão do HTML para não recarregar a página */}
            <Link to="/objetos" className="btn-cancelar">Cancelar</Link>
            <button type="submit" className="btn-salvar">Salvar</button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default CadastroObjeto