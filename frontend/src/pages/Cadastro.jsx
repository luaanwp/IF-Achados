import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { API_URL } from '../config/api'

function Cadastro() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (senha !== confirmarSenha) {
      alert('As senhas introduzidas não coincidem.')
      return
    }

    setCarregando(true)
    try {
      const response = await fetch(`${API_URL}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha }),
      })

      if (!response.ok) {
        throw new Error('Ocorreu um erro ao realizar o cadastro. Tente novamente.')
      }

      alert('Conta criada com sucesso! A redirecionar para a página de Login...')
      navigate({ to: '/login' })
    } catch (error) {
      alert(error.message)
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

        <h2>Crie sua conta</h2>

        <p className="subtitle">
          Preencha os dados abaixo para se cadastrar
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

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
            <input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmarSenha">
              Confirmar senha
            </label>

            <input
              id="confirmarSenha"
              type="password"
              placeholder="••••••••"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={carregando}
          >
            {carregando ? 'Criando conta...' : 'Criar Conta'}
          </button>

        </form>

        <p className="form-footer">
          Já tem uma conta?{' '}
          <Link to="/login">
            Entrar
          </Link>
        </p>

      </div>
    </div>
  </div>
)
}

export default Cadastro
a
b
c