import { Outlet, Link } from '@tanstack/react-router'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container">
          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden="true">
              <span /><span /><span />
              <span /><span /><span />
              <span /><span /><span />
            </span>
            <span className="logo-text">IF ACHADOS</span>
          </Link>

          <nav className="primary-navigation" aria-label="Navegação principal">
            <Link to="/">Início</Link>
            <Link to="/objetos">Objetos</Link>
            <Link to="/objetos/novo">Cadastrar item</Link>
            <a href="#categorias">Categorias</a>
            <a href="#sobre">Sobre</a>
          </nav>

          <Link to="/login" className="btn btn-primary btn-sm">
            Login
          </Link>
        </div>
      </header>

      <main id="conteudo-principal">
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2026 IF Achados. Sistema de achados e perdidos do IFMA Campus Grajaú.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
