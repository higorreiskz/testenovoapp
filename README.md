# ClipZone

ClipZone é uma plataforma web que aproxima criadores de conteúdo e clipadores, permitindo que ambos colaborem de forma transparente e lucrativa. O projeto está estruturado como um monorepositório com aplicações de **backend** (Node.js + Express + MongoDB) e **frontend** (React + Vite + TailwindCSS + Zustand).

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Guia de Configuração](#guia-de-configuração)
  - [Pré-requisitos](#pré-requisitos)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Fluxo de Autenticação](#fluxo-de-autenticação)
- [Boas Práticas de Desenvolvimento](#boas-práticas-de-desenvolvimento)
- [Próximos Passos](#próximos-passos)

## Visão Geral

O ClipZone oferece dashboards dedicados para criadores e clipadores, com métricas em tempo real, uploads de clipes e gerenciamento de CPM (custo por mil visualizações). O backend expõe APIs REST seguras via JWT e integrações prontas para armazenamento em nuvem. O frontend entrega uma experiência imersiva em dark mode, inspirada em plataformas como Twitch, Notion e PayPal.

## Funcionalidades Principais

- Registro e login de usuários (criadores ou clipadores).
- Definição de CPM por criador.
- Upload de clipes pelos clipadores e cálculo automático de earnings (`views × CPM / 1000`).
- Dashboards com métricas de views, ganhos e aprovações.
- Painel administrativo básico para gerenciamento de usuários e clipes.
- Integração preparada para provedores de upload (Cloudinary / Firebase Storage).

## Arquitetura do Projeto

```
.
├── backend
│   ├── package.json
│   ├── tsconfig.json
│   └── src
│       ├── app.ts
│       ├── server.ts
│       ├── config
│       │   ├── cloudinary.ts
│       │   └── db.ts
│       ├── controllers
│       │   ├── authController.ts
│       │   ├── clipController.ts
│       │   └── creatorController.ts
│       ├── middleware
│       │   └── authMiddleware.ts
│       ├── models
│       │   ├── Clip.ts
│       │   └── User.ts
│       ├── routes
│       │   ├── authRoutes.ts
│       │   ├── clipRoutes.ts
│       │   ├── creatorRoutes.ts
│       │   └── index.ts
│       └── utils
│           └── token.ts
├── frontend
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── src
│       ├── App.tsx
│       ├── main.tsx
│       ├── index.css
│       ├── assets
│       │   └── logo.svg
│       ├── components
│       │   ├── ClipUploadForm.tsx
│       │   ├── DashboardLayout.tsx
│       │   ├── NavBar.tsx
│       │   ├── StatCard.tsx
│       │   └── UserBadge.tsx
│       ├── pages
│       │   ├── AdminPanel.tsx
│       │   ├── ClipperDashboard.tsx
│       │   ├── CreatorDashboard.tsx
│       │   └── LoginPage.tsx
│       ├── router
│       │   └── index.tsx
│       └── store
│           └── useAuthStore.ts
├── .env.example
└── README.md
```

## Guia de Configuração

### Pré-requisitos

- Node.js >= 18
- npm ou yarn/pnpm (ex.: npm >= 9)
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas) ou instância local do MongoDB
- Conta e credenciais no [Cloudinary](https://cloudinary.com/) (ou provedor equivalente)

### Backend

1. Instale as dependências:

   ```bash
   cd backend
   npm install
   ```

2. Copie `.env.example` para `.env` e preencha os valores:

   ```bash
   cp ../.env.example .env
   ```

   | Variável                    | Descrição                                               |
   |-----------------------------|---------------------------------------------------------|
   | `PORT`                      | Porta exposta pelo servidor (default: 4000)             |
   | `MONGO_URI`                 | String de conexão com o MongoDB                         |
   | `JWT_SECRET`                | Segredo usado para assinar os tokens JWT                |
   | `CLOUDINARY_CLOUD_NAME`     | Nome do cloud na conta Cloudinary                       |
   | `CLOUDINARY_API_KEY`        | API Key do Cloudinary                                   |
   | `CLOUDINARY_API_SECRET`     | API Secret do Cloudinary                                |

3. Execute o servidor em modo desenvolvimento:

   ```bash
   npm run dev
   ```

   A API ficará disponível em `http://localhost:4000` com o endpoint de health check em `GET /api/health`.

### Frontend

1. Instale as dependências:

   ```bash
   cd frontend
   npm install
   ```

2. Inicie o projeto em modo desenvolvimento:

   ```bash
   npm run dev
   ```

   A aplicação abrirá em `http://localhost:5173` com hot reload habilitado.

> **Dica:** Configure o arquivo `frontend/src/services/api.ts` para apontar para o domínio/porta do backend antes de integrar as chamadas reais.

## Fluxo de Autenticação

1. Usuário registra uma conta informando `nome`, `email`, `senha` e `papel` (`creator` ou `clipper`).
2. Backend armazena a senha com bcrypt e retorna um token JWT.
3. Token é persistido no Zustand store no frontend para autenticação automática.
4. Rotas protegidas exigem header `Authorization: Bearer <TOKEN>`.

## Boas Práticas de Desenvolvimento

- Utilize os scripts definidos no `package.json` para garantir consistência.
- Mantenha as interfaces do banco alinhadas com os modelos Mongoose.
- Extraia funções para serviços quando houver regras de negócio reutilizáveis.
- Evite espalhar lógica de autenticação pelos componentes; prefira hooks e stores centralizados.

## Próximos Passos

- Implementar fluxo de aprovação/rejeição de clipes diretamente no dashboard do criador.
- Adicionar gráficos reais (ex.: Recharts) para estatísticas.
- Integrar webhooks de plataformas de streaming para automatizar atualizações de views.
- Preparar pipelines de CI/CD para Vercel (frontend) e Render (backend) com variáveis de ambiente seguras.

---

Com essa base, o ClipZone já oferece um esqueleto completo para acelerar o desenvolvimento das próximas features da plataforma.
