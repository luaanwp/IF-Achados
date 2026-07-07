markdown_content = """# Documentação da API REST — IF Achados

Esta documentação detalha os endpoints, contratos de dados, fluxos de autenticação e padrões de resposta da API REST do sistema **IF Achados** (Sistema de Achados e Perdidos para o IFMA Campus Grajaú).

---

## 1. Visão Geral da Arquitetura

O sistema adota uma arquitetura completamente desacoplada (*stateless*):

* **Backend:** Java 21 + Spring Boot (Porta `8080`)
* **Frontend:** React (Vite + TanStack Router) (Porta `5173`)
* **Base de Dados:** MySQL com persistência gerida via Spring Data JPA / Hibernate.

### Ambientes e URLs Base

* **Desenvolvimento (API):** `http://localhost:8080`
* **Prefixo Global das Rotas Protegidas/Negociais:** `/api`
* **Directório de Ficheiros Estáticos (Uploads):** `http://localhost:8080/uploads/`

---

## 2. Autenticação e Segurança (JWT)

A API utiliza **JSON Web Tokens (JWT)** assinados com o algoritmo `HMAC SHA-256 (HS256)` para proteger rotas privadas. As senhas são encriptadas de forma segura na base de dados utilizando o algoritmo **BCrypt** através do `PasswordEncoder`.

### Fluxo de Autenticação

1. O utilizador envia as suas credenciais para o endpoint público `/auth/login`.
2. O backend valida as credenciais e devolve um token JWT válido por **1 hora**.
3. O frontend armazena o token e o e-mail no `localStorage` (chaves `token` e `email`).
4. Para todas as requisições subsequentes a rotas protegidas, o frontend deve incluir o token no cabeçalho HTTP:


## Códigos de Resposta HTTP
A API segue estritamente os padrões semânticos do protocolo HTTP:

200 OK: Requisição processada com sucesso.

201 Created: Recurso criado com sucesso (utilizado em cadastros).

400 Bad Request: Dados de entrada inválidos ou erro de validação.

401 Unauthorized: Utilizador não autenticado ou credenciais inválidas.

403 Forbidden: Utilizador autenticado, mas sem permissão para aceder ao recurso.

404 Not Found: Recurso solicitado não foi encontrado na base de dados.

500 Internal Server Error: Erro interno no servidor (excepções não tratadas).

## 1. Referência de Endpoints
4.1 Autenticação (AuthController)
[POST] Realizar Login de Utilizador
URL: /auth/login

Acesso: Público

Corpo da Requisição (JSON):

JSON
{
  "email": "<usuario@ifma.edu.br>",
  "senha": "SenhaSegura123"
}
Resposta de Sucesso (200 OK):

JSON
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "<usuario@ifma.edu.br>"
}
Resposta de Erro (401 Unauthorized):

JSON
{
  "error": "Unauthorized",
  "message": "Credenciais inválidas"
}
4.2 Utilizadores (UserController)
[POST] Registar Novo Utilizador
URL: /usuarios

Acesso: Público

Corpo da Requisição (JSON):

JSON
{
  "nome": "João Silva",
  "email": "<joao.silva@ifma.edu.br>",
  "senha": "SenhaSegura123",
  "telefone": "99999999999",
  "imagem": "nome_da_imagem.jpg"
}
Nota de Implementação: No backend, o campo da entidade correspondente ao caminho da foto é mapeado internamente como imagemurl, mas o DTO recebe-o como imagem. A senha é automaticamente submetida ao hash BCrypt antes da persistência.

Resposta de Sucesso (201 Created):

JSON
{
  "id": 1,
  "nome": "João Silva",
  "email": "<joao.silva@ifma.edu.br>",
  "telefone": "99999999999",
  "imagem": "nome_da_imagem.jpg"
}
4.3 Categorias (CategoriaController)
[GET] Listar Todas as Categorias
URL: /api/categorias

Acesso: Público (Utilizado para preencher selectores e filtros na Home e na listagem)

Resposta de Sucesso (200 OK):

JSON
[
  {
    "id": 1,
    "nome": "Documentos"
  },
  {
    "id": 2,
    "nome": "Eletrónicos"
  },
  {
    "id": 3,
    "nome": "Chaves"
  }
]
4.4 Objetos (ObjetoController)
[POST] Registar um Objeto (Achado ou Perdido)
URL: /api/objetos

Acesso: Protegido (Exige Token JWT)

Tipo de Conteúdo: multipart/form-data

Parâmetros do Formulário:

nome (String): Nome do objeto (ex: "Chaveiro Azul").

descricao (String): Detalhes do local ou do item.

local (String): Onde foi encontrado/perdido.

data (String): Data do ocorrido (Formato AAAA-MM-DD).

categoria (String): Nome da categoria (o Spring pesquisa ou cria dinamicamente).

file (MultipartFile): Ficheiro de imagem do objeto (guardado em uploads/objetos/).

Regra de Negócio: O objeto é registado automaticamente com o status inicial definido como "disponivel" e associado ao utilizador autenticado (extraído a partir do Token).

Resposta de Sucesso (201 Created):

JSON
{
  "id": 12,
  "nome": "Chaveiro Azul",
  "descricao": "Encontrado perto do bloco A",
  "local": "Bloco A",
  "data": "2026-07-07",
  "status": "disponivel",
  "imagemUrl": "uploads/objetos/abc123_foto.jpg",
  "categoria": {
    "id": 3,
    "nome": "Chaves"
  }
}
[GET] Listar Todos os Objetos (Filtros Opcionais)
URL: /api/objetos

Acesso: Público

Parâmetros de Consulta (Query Params - Opcionais):

categoria (String): Filtrar por nome da categoria.

status (String): Filtrar por disponivel ou devolvido.

Resposta de Sucesso (200 OK):

JSON
[
  {
    "id": 12,
    "nome": "Chaveiro Azul",
    "status": "disponivel",
    "imagemUrl": "uploads/objetos/abc123_foto.jpg"
  }
]
[GET] Listar Objetos do Utilizador Autenticado
URL: /api/objetos/meus

Acesso: Protegido (Exige Token JWT)

Resposta de Sucesso (200 OK): Retorna a lista de objetos cadastrados exclusivamente pelo utilizador associado ao token enviado.

[PUT] Atualizar Dados de um Objeto
URL: /api/objetos/{id}

Acesso: Protegido (Exige Token JWT + Ser Proprietário)

Corpo da Requisição (JSON):

JSON
{
  "nome": "Chaveiro Azul Escuro",
  "descricao": "Encontrado perto do banco do bloco A",
  "local": "Bloco A - Perto dos bancos",
  "data": "2026-07-07"
}
Limitação Atual: Este endpoint atualiza apenas os dados textuais do formulário. Alterações de imagem ou de categoria não são processadas por esta rota.

[PATCH] Marcar Objeto como Devolvido
URL: /api/objetos/{id}/devolvido

Acesso: Protegido (Exige Token JWT)

Descrição: Altera o campo status do objeto de "disponivel" para "devolvido". Utilizado pelo botão correspondente na interface de detalhes do objeto.

Resposta de Sucesso (200 OK):

JSON
{
  "id": 12,
  "status": "devolvido"
}
[DELETE] Remover um Objeto
URL: /api/objetos/{id}

Acesso: Protegido (Exige Token JWT + Ser Proprietário)

Resposta de Sucesso (200 OK): Objeto removido fisicamente da base de dados.

## Configurações Especiais de Infraestrutura
Para que o upload e exibição de ficheiros funcionem corretamente no servidor, as seguintes configurações do ecossistema Spring Boot são mandatórias:

5.1 Limites de Upload (application.properties)
O Spring Boot, por padrão, rejeita ficheiros grandes (como fotos de telemóveis). É necessário ajustar as propriedades abaixo:

Properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
5.2 Mapeamento de Recursos Estáticos (WebMvcConfigurer)
Para expor a pasta física do disco rígido onde as fotos são salvas, é obrigatória a inclusão do prefixo file: na configuração do caminho absoluto:

Java
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/uploads/**")
            .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/");
}
"""

with open("api.md", "w", encoding="utf-8") as f:
f.write(markdown_content)

print("api.md generated successfully.")
