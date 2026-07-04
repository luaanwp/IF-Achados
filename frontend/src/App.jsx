import { Outlet, Link, useRouterState } from '@tanstack/react-router'

function App() {
  // Hook do tanstack-router para saber a rota atual e marcar o menu como "active"
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <>
      <header className="navbar">
        <div className="logo">
          <Link to="/">
            <i className="fa-solid fa-layer-group"></i> IF <span>ACHADOS</span>
          </Link>
        </div>
        <nav>
          <Link to="/" className={currentPath === '/' ? 'active' : ''}>Início</Link>
          <Link to="/objetos" className={currentPath.startsWith('/objetos') ? 'active' : ''}>Objetos</Link>
          {/* Supondo que você crie a rota /painel depois */}
          <Link to="/login" className="btn-login-nav">Login</Link>
        </nav>
      </header>

      {/* O Outlet renderiza as páginas filhas dependendo da rota */}
      <Outlet />
    </>
  )
}

export default App