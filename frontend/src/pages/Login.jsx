import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { API_URL } from '../config/api'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      })

      if (!response.ok) {
        setErro('E-mail ou senha inválidos.')
        setCarregando(false)
        return
      }

      const token = await response.text()

      localStorage.setItem('token', token)
      localStorage.setItem('email', email)

      navigate({ to: '/painel' })
    } catch (err) {
      console.error('Erro ao fazer login:', err)
      setErro('Erro ao conectar com o servidor. Tente novamente.')
    } finally {
      setCarregando(false)
    }
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
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />

              <i
                className={`fa-regular ${mostrarSenha ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
                onClick={() => setMostrarSenha(!mostrarSenha)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          {erro && <p style={{ color: 'red', fontSize: '0.9rem' }}>{erro}</p>}

          <button
            type="submit"
            className="btn-submit"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
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