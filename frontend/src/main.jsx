import ReactDOM from "react-dom/client"
import BuscaSection from "./components/BuscaSection"
import CadastroSection from "./components/CadastroSection"

const rootBusca = document.getElementById("root-busca")
const rootCadastro = document.getElementById("root-cadastro")

if (rootBusca) {
  ReactDOM.createRoot(rootBusca).render(<BuscaSection />)
}

if (rootCadastro) {
  ReactDOM.createRoot(rootCadastro).render(<CadastroSection />)
}