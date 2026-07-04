import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'

import App from './App'
import Home from './pages/Home'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import ListaObjetos from './pages/ListaObjetos'
import CadastroObjeto from './pages/CadastroObjeto'
import ObjetoDetalhes from './pages/ObjetoDetalhes'

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
  objetoDetalhesRoute,
])

export const router = createRouter({ routeTree })
