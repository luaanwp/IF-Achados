// Ponto de entrada da aplicação React (equivalente ao "main" de um programa Java).
// É este arquivo que o Vite carrega primeiro (referenciado no index.html).
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'

import { router } from './router'
import './styles/global.css'

// Monta a aplicação inteira dentro da <div id="root"> do index.html.
// O RouterProvider entrega o controle de "o que renderizar" para o TanStack
// Router (definido em router.jsx), que decide a página com base na URL atual.
// StrictMode é só uma ferramenta de desenvolvimento do React para detectar
// efeitos colaterais indevidos — não afeta o build de produção.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
