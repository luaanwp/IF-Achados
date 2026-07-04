import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { API_URL } from '../config/api'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    // TODO: integrar com POST `${API_URL}/api/login`
    console.log('login', { email, senha, API_URL })
  }

  return (
    <div className="bg-split">
    <div className="auth-container">
      <div className="card-form">

        <div className="logo-center">
          <i className="fa-solid fa-layer-group"></i>
          {' '}IF <span>ACHADOS</span>
        </div>

        <h2>Bem-vindo de volta!</h2>

        <p className="subtitle">
          Faça login para continuar
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>

            <div className="password-wrapper">
              <input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />

              <i className="fa-regular fa-eye toggle-password"></i>
            </div>
          </div>

          <button
            type="submit"
            className="btn-submit"
          >
            Entrar
          </button>

        </form>

        <p className="form-footer">
          Não tem uma conta?{' '}
          <Link to="/cadastro">
            Criar conta
          </Link>
        </p>

      </div>
    </div>
    </div>
  )
}

export default Login