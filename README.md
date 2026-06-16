# OniBus Express — Frontend

Sistema de venda de passagens rodoviárias desenvolvido como desafio técnico.

---

## Tecnologias

- **React 18** com TypeScript
- **Vite** — build tool moderna que substitui o Create React App
- **Tailwind CSS** — estilização utilitária
- **Shadcn/ui** — componentes de UI acessíveis construídos sobre Radix UI
- **Zustand** — gerenciamento de estado global com persistência em sessionStorage
- **React Router DOM** — roteamento client-side
- **React Hook Form + Zod** — formulários com validação tipada
- **Axios** — cliente HTTP
- **MSW (Mock Service Worker)** — mock de API para desenvolvimento e modo demo
- **Vitest + Testing Library** — testes de componentes e hooks
- **Cypress** — testes end-to-end
- **Husky + lint-staged** — pre-commit hooks para garantir qualidade do código

---

## Decisões de Arquitetura

### Vite no lugar do Create React App

O CRA está abandonado e usa Webpack internamente, que é lento. O Vite oferece HMR instantâneo e build muito mais rápido, sendo o padrão atual do mercado.

### Zustand no lugar de Redux

O fluxo de compra é linear (busca → assento → passageiro → confirmação), o que não justifica a complexidade do Redux. O Zustand resolve com menos código e sem boilerplate. O estado é persistido no `sessionStorage` — se o usuário der F5 no meio do fluxo, não perde os dados.

### React Hook Form + Zod

Combinação padrão do mercado para formulários com validação tipada. Os schemas ficam em `src/schemas/` separados dos componentes, facilitando reuso e testes.

### MSW para mock de API

O MSW intercepta requisições reais do Axios no browser sem precisar alterar o código de produção. Em desenvolvimento ativa automaticamente. Em produção pode ser ativado via `VITE_DEMO_MODE=true`, permitindo demonstrar o frontend sem depender de um backend.

### Multi-stage build no Docker

O Dockerfile usa duas etapas — Node para compilar e Nginx para servir. O container final não tem Node, apenas os arquivos estáticos e o Nginx, resultando em uma imagem menor e mais segura. O Nginx também garante que o React Router funcione corretamente em produção via `try_files`.

### Componentes mockados nos testes

Componentes complexos de UI do Shadcn (DatePicker, RouteCombobox) que dependem de APIs do browser não suportadas pelo jsdom são mockados nos testes de página. Cada um tem seus próprios testes unitários isolados.

### Pre-commit hooks com Husky

O lint-staged roda o ESLint apenas nos arquivos alterados antes de cada commit — mais rápido que rodar o lint no projeto inteiro. Os testes completos ficam no CI via GitHub Actions.

---

## O que foi implementado

- Tela de busca de passagens com autocomplete de rotas
- Tela de seleção de assento com mapa visual e skeleton loading
- Tela de dados do passageiro com validação de CPF e máscara
- Tela de confirmação da reserva com código gerado
- Tela de consulta e cancelamento de reserva por código (bônus)
- Validação de formulários com Zod e React Hook Form
- Hook customizado de máscara de CPF
- DatePicker com calendário visual
- Autocomplete de cidades com RouteCombobox
- Header com navegação global
- Dark mode com detecção automática de preferência do sistema
- Feedback visual com toasts (Sonner) para erros e sucesso
- Skeleton loading nas listagens e mapas de assento
- Persistência de estado entre reloads com sessionStorage
- Página 404 para rotas não encontradas
- Mock de API com MSW (desenvolvimento e modo demo)
- Docker com Nginx e suporte a modo demo sem backend
- Testes unitários com Vitest + Testing Library (48 testes)
- Teste E2E com Cypress cobrindo o fluxo completo de compra
- CI/CD com GitHub Actions (lint, testes unitários e E2E)
- Pre-commit hooks com Husky + lint-staged

## O que ficaria para uma próxima iteração

- Integração com backend real
- Paginação na listagem de viagens
- Testes E2E cobrindo mais cenários (cancelamento, erro de API)

---

## Como rodar

### Com Docker (recomendado)

Não é necessário ter Node instalado. A aplicação sobe com dados mockados — nenhum backend é necessário.

```bash
docker compose up --build
```

Acesse `http://localhost`.

### Sem Docker

Requer Node 24.

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

---

## Variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

| Variável         | Padrão                  | Descrição                   |
| ---------------- | ----------------------- | --------------------------- |
| `VITE_API_URL`   | `http://localhost:3000` | URL do backend              |
| `VITE_DEMO_MODE` | `true`                  | Ativa o mock de API via MSW |

---

## Como rodar os testes

### Testes unitários

```bash
npm test
```

Para rodar em modo watch:

```bash
npx vitest
```

### Testes E2E

Com a aplicação rodando localmente:

```bash
npm run dev
npm run cy:run
```

Para abrir a interface visual do Cypress:

```bash
npm run cy:open
```

---

## Endpoints mockados

| Método   | Endpoint            | Descrição                                |
| -------- | ------------------- | ---------------------------------------- |
| `GET`    | `/rotas`            | Lista rotas disponíveis                  |
| `GET`    | `/viagens`          | Busca viagens por origem, destino e data |
| `GET`    | `/viagens/:id`      | Retorna assentos de uma viagem           |
| `POST`   | `/reservas`         | Cria uma reserva                         |
| `GET`    | `/reservas/:codigo` | Consulta uma reserva pelo código         |
| `DELETE` | `/reservas/:codigo` | Cancela uma reserva                      |

---

## Estrutura do projeto

```
src/
├── tests/          — testes de componentes e hooks
├── components/
│   └── ui/             — componentes do Shadcn
├── hooks/              — hooks customizados
├── mocks/              — handlers do MSW
├── pages/              — páginas da aplicação
├── schemas/            — schemas de validação com Zod
├── services/           — camada de comunicação com a API
├── store/              — estado global com Zustand
└── types/              — tipos TypeScript
cypress/
└── e2e/                — testes end-to-end
.github/
└── workflows/          — pipelines de CI/CD
├── lint.yml
├── test.yml
└── e2e.yml

```

---
