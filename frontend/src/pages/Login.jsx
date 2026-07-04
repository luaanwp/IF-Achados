import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { API_URL } from '../config/api'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    // TODO: integrar com POST {API_URL}/api/login
    console.log('login', { email, senha, API_URL })
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <span className="logo-mark logo-mark-lg" aria-hidden="true">
          <span /><span /><span />
          <span /><span /><span />
          <span /><span /><span />
        </span>

        <h1>IF ACHADOS</h1>
        <p className="auth-subtitle">Bem-vindo de volta! Faça login para continuar.</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="••••••••••"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Entrar
          </button>
        </form>

        <p className="auth-switch">
          Não tem uma conta? <Link to="/cadastro">Criar conta</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
