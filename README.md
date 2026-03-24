# 💡 Sistema de Gestão de Ideias

Aplicação fullstack desenvolvida como desafio técnico, com o objetivo de
gerenciar o ciclo de vida de ideias dentro de uma organização.

------------------------------------------------------------------------

## 🚀 Tecnologias

### Frontend

-   React
-   Next.js
-   Tailwind CSS

### Backend

-   Node.js
-   Express

### Banco de Dados

-   MariaDB

------------------------------------------------------------------------

## 🧠 Arquitetura

A aplicação segue uma arquitetura em camadas:

-   Routes → definição das rotas da API
-   Controllers → controle de requisições e respostas
-   Services → regras de negócio
-   Database → persistência dos dados

Fluxo:

Frontend → Backend (API REST) → Banco de Dados

------------------------------------------------------------------------

## 🧱 Modelagem do Banco

### Tabelas principais:

-   ideas
-   observations
-   classifications

### Relacionamentos:

-   Uma ideia pode ter várias observações (1:N)
-   Uma ideia pode ter apenas uma classificação (1:1)

------------------------------------------------------------------------

## 🔥 Regras de Negócio

-   Uma ideia só pode ser classificada uma vez
-   Após classificação:
    -   Não pode ser editada
    -   Não pode receber novas observações
-   O status da ideia é atualizado automaticamente ao classificar

------------------------------------------------------------------------

## ⚙️ Funcionalidades Implementadas

### Ideias

-   Criar ideia
-   Listar ideias
-   Ver detalhes de uma ideia
-   Atualizar ideia (com validação de bloqueio)

### Classificação

-   Classificar uma ideia
-   Visualizar classificação

------------------------------------------------------------------------

## 📡 Endpoints

### Ideias

  Método   Rota         Descrição
  -------- ------------ -------------------
  POST     /ideas       Criar nova ideia
  GET      /ideas       Listar ideias
  GET      /ideas/:id   Detalhes da ideia
  PUT      /ideas/:id   Atualizar ideia

### Classificação

  Método   Rota                        Descrição
  -------- --------------------------- -------------------
  POST     /ideas/:id/classification   Classificar ideia
  GET      /ideas/:id/classification   Ver classificação

------------------------------------------------------------------------

## 🧪 Testes

Testes realizados via Insomnia:

-   Criação de ideias
-   Classificação
-   Validação de regras

------------------------------------------------------------------------

## ⚠️ Decisões de Escopo

-   Priorização das regras centrais do domínio
-   Foco na consistência do sistema
-   Estrutura escalável do backend

------------------------------------------------------------------------

## 🚀 Como rodar o projeto

### Backend

cd ideas-api npm install npm run dev

### Frontend

cd ideas-web npm install npm start

### Banco de Dados

-   Criar banco ideas_db
-   Executar script SQL

------------------------------------------------------------------------

## 🔮 Melhorias Futuras

-   Autenticação
-   Paginação
-   Testes automatizados
-   Docker
-   Melhorias de UX

------------------------------------------------------------------------

## 👨‍💻 Autor

Lucas Gaudio
