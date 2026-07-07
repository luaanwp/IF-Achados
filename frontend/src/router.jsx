// Define todas as rotas da aplicação usando "code-based routing" do TanStack
// Router: cada página é uma createRoute() associada a um path e a um
// componente, e todas viram filhas da rootRoute (que renderiza App.jsx).
// Rotas com "$" no path (ex: $objetoId) são parâmetros dinâmicos da URL —
// o TanStack Router casa o path mais específico automaticamente
// (ex: /objetos/novo não conflita com /objetos/$objetoId).
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'

import App from './App'
import Home from './pages/Home'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import ListaObjetos from './pages/ListaObjetos'
import CadastroObjeto from './pages/CadastroObjeto'
import EditarObjeto from './pages/EditarObjeto'
import ObjetoDetalhes from './pages/ObjetoDetalhes'
import Painel from './pages/Painel'
import Perfil from './pages/Perfil'

// Rota raiz: renderiza o layout (App.jsx), que tem o header/nav/footer
// e o <Outlet /> onde as rotas filhas abaixo entram.
const rootRoute = createRootRoute({
  component: App,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
})

const cadastroRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cadastro',
  component: Cadastro,
})

const objetosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/objetos',
  component: ListaObjetos,
})

const novoObjetoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/objetos/novo',
  component: CadastroObjeto,
})

const painelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/painel',
  component: Painel,
})

const perfilRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/perfil',
  component: Perfil,
})

const editarObjetoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/objetos/editar/$objetoId',
  component: EditarObjeto,
})

const objetoDetalhesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/objetos/$objetoId',
  component: ObjetoDetalhes,
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  cadastroRoute,
  objetosRoute,
  novoObjetoRoute,
  editarObjetoRoute,
  objetoDetalhesRoute,
  painelRoute,
  perfilRoute,
])

export const router = createRouter({ routeTree })
