import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { API_URL } from '../config/api'

function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem.')
      return
    }
    // TODO: integrar com POST {API_URL}/api/usuarios
    console.log('cadastro de usuario', { nome, email, senha, API_URL })
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <span className="logo-mark logo-mark-lg" aria-hidden="true">
          <span /><span /><span />
          <span /><span /><span />
          <span /><span /><span />
        </span>

        <h1>Crie sua conta</h1>
        <p className="auth-subtitle">Preencha os dados abaixo para se cadastrar.</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              required
            />
          </div>

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

          <div>
            <label htmlFor="confirmarSenha">Confirmar senha</label>
            <input
              id="confirmarSenha"
              type="password"
              placeholder="••••••••••"
              value={confirmarSenha}
              onChange={(event) => setConfirmarSenha(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Criar Conta
          </button>
        </form>

        <p className="auth-switch">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}

export default Cadastro
