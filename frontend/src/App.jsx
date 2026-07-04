import { Outlet, Link, useRouterState } from '@tanstack/react-router'

function App() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const isAuthPage =
    currentPath === '/login' || currentPath === '/cadastro'

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

            <Link
              to="/login"
              className="btn-login-nav"
            >
              Login
            </Link>
          </nav>
        </header>
      )}

      <Outlet />
    </>
  )
}

export default App