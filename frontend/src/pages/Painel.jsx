import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { API_URL } from '../config/api'

// Verifica se o token existe e ainda não expirou
function tokenValido(token) {
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiraEm = payload.exp * 1000 // exp vem em segundos, Date usa milissegundos
    return Date.now() < expiraEm
  } catch {
    return false
  }
}

function Painel() {
  const [objetos, setObjetos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [autorizado, setAutorizado] = useState(false)
  const navigate = useNavigate()

  // Proteção de rota: só libera o conteúdo se o token existir e for válido
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

  useEffect(() => {
    if (!autorizado) return

    fetch(`${API_URL}/api/objetos`)
      .then((response) => {
        if (!response.ok) throw new Error('Falha ao buscar objetos')
        return response.json()
      })
      .then((dados) => setObjetos(dados))
      .catch(() => setObjetos([]))
      .finally(() => setCarregando(false))
  }, [autorizado])

  // Função de Excluir (Simulada no Front por enquanto)
  function handleDelete(id, nome) {
    if (confirm(`Tem certeza que deseja excluir o objeto "${nome}"?`)) {
      // TODO: integrar com DELETE {API_URL}/api/objetos/{id}
      
      // Remove da tela instantaneamente para o usuário ver acontecer
      setObjetos(objetos.filter(obj => obj.id !== id))
      alert(`Objeto "${nome}" excluído com sucesso!`)
    }
  }

  // Enquanto verifica o token, não renderiza nada (evita "piscar" a tela protegida)
  if (!autorizado) return null

  return (
    <main className="container">
      <section className="panel-section" style={{ padding: '2rem 0' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2>Painel de Administração</h2>
            <p className="subtitle-left" style={{ color: 'gray', marginTop: '0.2rem' }}>Gerencie os objetos perdidos e devolvidos</p>
          </div>
          <Link to="/objetos/novo" className="btn-salvar" style={{ textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px' }}>
            <i className="fa-solid fa-plus"></i> Novo Objeto
          </Link>
        </div>

        {carregando && <p style={{ textAlign: 'center', margin: '20px 0' }}>Carregando registros...</p>}
        
        {!carregando && objetos.length === 0 && (
          <p style={{ textAlign: 'center', margin: '20px 0' }}>Nenhum objeto cadastrado no sistema.</p>
        )}

        {!carregando && objetos.length > 0 && (
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px' }}>ID</th>
                  <th style={{ padding: '12px' }}>Objeto</th>
                  <th style={{ padding: '12px' }}>Categoria</th>
                  <th style={{ padding: '12px' }}>Local</th>
                  <th style={{ padding: '12px' }}>Data</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {objetos.map((objeto) => {
                  const isDisponivel = objeto.status !== 'devolvido';
                  const categoriaNome = objeto.categoria.nome.toLowerCase();

                  let catClass = "cat-outros";
                  if (categoriaNome === "documentos") catClass = "cat-doc";
                  else if (categoriaNome === "eletronicos") catClass = "cat-eletr";
                  else if (categoriaNome === "materiais") catClass = "cat-mat";
                  else if (categoriaNome === "vestuario") catClass = "cat-vest";

                  return (
                    <tr key={objeto.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>#{objeto.id}</td>
                      <td style={{ padding: '12px' }}><strong>{objeto.nome}</strong></td>
                      <td style={{ padding: '12px' }}><span className={`tag ${catClass}`}>{objeto.categoria.nome}</span></td>
                      <td style={{ padding: '12px' }}>{objeto.local}</td>
                      <td style={{ padding: '12px' }}>{objeto.data}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`tag ${isDisponivel ? 'status-disp' : 'status-dev'}`}>
                          {isDisponivel ? 'Disponível' : 'Devolvido'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div className="action-buttons" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <Link to={`/objetos/${objeto.id}`} className="btn-detalhes" style={{ padding: '4px 8px', fontSize: '0.9rem', textDecoration: 'none' }} title="Ver Detalhes">
                            <i className="fa-solid fa-eye"></i>
                          </Link>
                          
                          <button 
                            className="btn-salvar" 
                            style={{ padding: '4px 10px', fontSize: '0.9rem', background: '#e0a800', borderColor: '#e0a800' }} 
                            title="Editar"
                            onClick={() => alert(`Editar o objeto: "${objeto.nome}" (Funcionalidade de formulário em breve!)`)}
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          
                          <button 
                            className="btn-cancelar" 
                            style={{ padding: '4px 10px', fontSize: '0.9rem', margin: 0 }} 
                            title="Excluir"
                            onClick={() => handleDelete(objeto.id, objeto.nome)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default Painel