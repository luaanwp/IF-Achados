import { Outlet, Link, useRouterState } from '@tanstack/react-router'

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

  // Abordagem simples: lê o e-mail salvo no localStorage no momento do login
  // (não decodifica o JWT). Isso decide se mostra "Login" ou o e-mail do
  // usuário logado na navbar, e se o link "Perfil" aparece.
  const emailLogado = localStorage.getItem('email')

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
