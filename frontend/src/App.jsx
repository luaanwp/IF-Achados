import { useEffect, useState } from 'react'
import { Outlet, Link, useRouterState } from '@tanstack/react-router'

// Mesma checagem usada em Perfil.jsx, Painel.jsx, CadastroObjeto.jsx etc:
// decodifica o payload do JWT (sem verificar assinatura, só leitura local)
// e compara a data de expiração ("exp", em segundos) com o horário atual.
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

// App é o "layout raiz": todas as rotas do router.jsx são renderizadas dentro
// dele, no lugar do <Outlet /> lá embaixo. É aqui que fica a navbar, que
// portanto aparece em todas as páginas, exceto Login e Cadastro.
function App() {
  // useRouterState() dá acesso à URL atual, usado para saber em qual página
  // o usuário está (e destacar o link correspondente na navbar com "active").
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  // Nas telas de login/cadastro a navbar não faz sentido (usuário ainda não
  // "entrou" no sistema), então ela é escondida nessas duas rotas.
  const isAuthPage =
    currentPath === '/login' || currentPath === '/cadastro'

  // Antes era `localStorage.getItem('email')` direto, sem checar se o token
  // ainda era válido — por isso o e-mail continuava aparecendo na navbar
  // mesmo depois do JWT expirar. Agora é estado + validação do token.
  const [emailLogado, setEmailLogado] = useState(null)

  useEffect(() => {
    // Confere o token agora: se expirou, limpa o localStorage e esconde o e-mail.
    function sincronizarSessao() {
      const token = localStorage.getItem('token')
      if (tokenValido(token)) {
        setEmailLogado(localStorage.getItem('email'))
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        setEmailLogado(null)
      }
    }

    sincronizarSessao()

    // Agenda a próxima checagem pro exato instante em que o token expira,
    // assim o e-mail some sozinho da navbar mesmo se o usuário ficar parado
    // na mesma página (sem precisar navegar ou recarregar a aba).
    let timer
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const msAteExpirar = payload.exp * 1000 - Date.now()
        if (msAteExpirar > 0) {
          timer = setTimeout(sincronizarSessao, msAteExpirar + 500)
        }
      } catch {
        // token malformado: sincronizarSessao() acima já tratou (tokenValido retorna false)
      }
    }

    return () => clearTimeout(timer)
    // Reexecuta a cada troca de rota também, pra pegar login/logout feitos
    // em outras páginas (ex: Login.jsx salva o token e navega pro /painel).
  }, [currentPath])

  return (
    <>
      {!isAuthPage && (
        <header className="navbar">
          <div className="logo">
            <Link to="/">
              <i className="fa-solid fa-layer-group"></i>
              IF <span>ACHADOS</span>
            </Link>
          </div>

          <nav>
            <Link
              to="/"
              className={currentPath === '/' ? 'active' : ''}
            >
              Início
            </Link>

            <Link
              to="/objetos"
              className={currentPath.startsWith('/objetos') ? 'active' : ''}
            >
              Objetos
            </Link>

            <Link
              to="/painel"
              className={currentPath.startsWith('/painel') ? 'active' : ''}
            >
              Painel
            </Link>

            {emailLogado && (
              <Link
                to="/perfil"
                className={currentPath.startsWith('/perfil') ? 'active' : ''}
              >
                Perfil
              </Link>
            )}

            {emailLogado ? (
              <span className="user-logado">{emailLogado}</span>
            ) : (
              <Link to="/login" className="btn-login-nav">
                Login
              </Link>
            )}
          </nav>
        </header>
      )}

      <Outlet />
    </>
  )
}

export default App
