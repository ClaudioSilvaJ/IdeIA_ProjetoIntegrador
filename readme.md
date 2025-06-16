# IdeIA_ProjetoIntegrador

Este repositório contém o código-fonte para o projeto IdeIA, uma aplicação que integra um backend em FastAPI com um frontend em React, utilizando MongoDB para persistência de dados e Ollama para interação com modelos de linguagem de IA. O projeto visa fornecer uma plataforma interativa para comunicação com uma IA, com funcionalidades de chat e gerenciamento de mensagens.

## Tecnologias Utilizadas

### Backend (Python - FastAPI)

*   **FastAPI**: Um framework web moderno e rápido para construir APIs com Python 3.7+ baseado em tipagem padrão do Python.
*   **MongoDB**: Um banco de dados NoSQL orientado a documentos, utilizado para armazenar as mensagens e informações de usuários.
*   **Pymongo**: Driver Python para MongoDB.
*   **Ollama**: Utilizado para interagir com modelos de linguagem de IA (especificamente `llama3.1` neste projeto) para gerar respostas no chat.
*   **Uvicorn**: Servidor ASGI para rodar a aplicação FastAPI.
*   **uvloop**: Um loop de eventos rápido para `asyncio`.
*   **httptools**: Ferramentas de análise de HTTP.

### Frontend (JavaScript - React)

*   **React**: Uma biblioteca JavaScript para construir interfaces de usuário.
*   **Vite**: Uma ferramenta de build que oferece uma experiência de desenvolvimento frontend extremamente rápida.
*   **Axios**: Cliente HTTP baseado em Promises para o navegador e Node.js.
*   **React Router DOM**: Para roteamento de componentes no frontend.

## Estrutura do Projeto

O projeto está dividido em duas pastas principais: `backend` e `frontend`.

### `backend/`

Esta pasta contém a lógica do servidor e a API. Os principais arquivos são:

*   `main.py`: O ponto de entrada da aplicação FastAPI, definindo as rotas da API para chat, gerenciamento de mensagens e coleta de lixo anônima. Inclui configurações de CORS e gerenciamento de conexões WebSocket.
*   `chatgpt.py`: Contém a função `chatWithAI` que se comunica com o modelo de linguagem `llama3.1` via Ollama para gerar respostas.
*   `connection_manager.py`: Gerencia as conexões WebSocket ativas, permitindo o envio de mensagens pessoais e broadcast.
*   `message_model.py`: Define o modelo de dados para as mensagens, utilizando `pydantic` para validação.
*   `mongo.py`: Contém a classe `MongoDB` para interagir com o banco de dados MongoDB, incluindo métodos para inserção, busca, atualização e exclusão de documentos.
*   `util.py`: Inclui a classe `anon_garbage` para geração de tokens de usuário anônimos e lógica para coleta de lixo (ainda a ser implementada completamente).

### `frontend/`

Esta pasta contém a aplicação web React. Os principais diretórios e arquivos são:

*   `public/`: Contém arquivos estáticos como `index.html`.
*   `src/`: Contém o código-fonte da aplicação React.
    *   `App.jsx`: O componente principal da aplicação, que renderiza o roteador.
    *   `routes/Router.jsx`: Define as rotas da aplicação React.
    *   `components/`: Contém componentes React reutilizáveis.
    *   `views/`: Contém as páginas ou 

