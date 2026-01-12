# askMyDoc

Aplicacao web que permite o upload de documentos (PDFs ou imagens), realiza OCR automatico para extrair o texto e permite que o usuario faca perguntas sobre o conteudo usando uma IA. As interacoes e documentos sao armazenados e ficam disponiveis em uma interface simples. O acesso exige autenticacao via e-mail/senha ou login com Google.

**Deploy:** [ask-my-doc-frontend.vercel.app](https://ask-my-doc-frontend.vercel.app)

---

## Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 15, React 19, TypeScript, CSS Modules |
| Backend | NestJS 11, TypeScript, Passport.js |
| Banco de Dados | PostgreSQL, Prisma ORM |
| OCR | Tesseract.js, pdf-parse, pdftoppm |
| IA | OpenRouter API (LLaMA 3.2) |
| Monorepo | pnpm workspaces, Turborepo |

---

## Estrutura do Projeto

```
askMyDoc/
├── apps/
│   ├── backend/          # API NestJS
│   │   └── src/
│   │       ├── auth/     # Autenticacao (JWT, Google OAuth)
│   │       ├── document/ # Upload, OCR, Q&A
│   │       ├── user/     # Gerenciamento de usuarios
│   │       ├── prisma/   # Servico do Prisma
│   │       ├── config/   # Configuracoes centralizadas
│   │       └── utils/    # Utilitarios (OCR, sanitize)
│   └── frontend/         # App Next.js
│       └── src/
│           ├── app/      # Rotas (/, /auth/login, /auth/register)
│           ├── components/ # Componentes React
│           ├── lib/      # API client
│           └── styles/   # CSS Modules
├── packages/
│   └── prisma/           # Schema e migracoes
├── turbo.json            # Configuracao Turborepo
└── package.json          # Workspaces root
```

---

## Requisitos

- Node.js v18 ou superior
- pnpm instalado globalmente (`npm install -g pnpm`)
- PostgreSQL (local ou na nuvem: Railway, Supabase, Neon, etc.)
- pdftoppm (para OCR de PDFs) - `sudo apt install poppler-utils`

---

## Instalacao

### 1. Clone o projeto e instale as dependencias

```bash
git clone https://github.com/gabrielmmh/askMyDoc.git
cd askMyDoc
pnpm install
```

### 2. Configure os arquivos `.env`

#### `.env` na raiz (obrigatorio):

```env
# Banco de dados
DATABASE_URL=postgresql://<usuario>:<senha>@<host>:<porta>/<nome_do_banco>

# Autenticacao
JWT_SECRET=<chave_aleatoria_32_bytes>

# OpenRouter (IA)
OPENROUTER_API_KEY=<sua_chave_da_openrouter>

# Google OAuth
GOOGLE_CLIENT_ID=<client_id_do_google>
GOOGLE_CLIENT_SECRET=<client_secret_do_google>
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# URLs
FRONTEND_URL=http://localhost:3000
PORT=3001
```

#### `.env` na raiz (opcional):

```env
# LLM
LLM_MODEL=meta-llama/llama-3.2-3b-instruct:free
LLM_BASE_URL=https://openrouter.ai/api/v1

# Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# JWT
JWT_EXPIRES_IN=1h

# Cookie
COOKIE_MAX_AGE=604800000
```

#### `.env` em `apps/frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Para gerar o `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Configure as credenciais do Google

1. Acesse [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2. Crie um projeto (se ainda nao tiver)
3. Va ate "Tela de consentimento OAuth" e configure como externa
4. Crie uma credencial OAuth 2.0
   - URI de redirecionamento: `http://localhost:3001/auth/google/callback`
5. Copie o **Client ID** e o **Client Secret** e adicione no `.env` da raiz

### 4. Rode as migracoes do banco de dados

```bash
pnpm exec prisma migrate dev --schema=packages/prisma/schema.prisma
```

---

## Executando o Projeto

### Desenvolvimento

```bash
# Rodar frontend e backend simultaneamente
pnpm dev:all

# Ou separadamente:
pnpm dev:frontend  # http://localhost:3000
pnpm dev:backend   # http://localhost:3001
```

### Build de producao

```bash
pnpm --filter backend build
pnpm --filter frontend build
```

### Lint e verificacao de tipos

```bash
pnpm --filter backend lint
pnpm --filter frontend lint
```

---

## Modelo de Dados

```
User
├── id, name, email, password?, provider
└── documents[]

Document
├── id, userId, filename, filepath
├── ocrResult?
└── interactions[]

OcrResult
├── id, documentId, content
└── createdAt

Interaction
├── id, documentId, question, answer
└── createdAt
```

---

## Endpoints da API

| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | `/auth/login` | Login com email/senha |
| POST | `/auth/register` | Registro de usuario |
| GET | `/auth/google` | Inicia OAuth Google |
| GET | `/auth/google/callback` | Callback OAuth |
| GET | `/auth/logout` | Logout |
| GET | `/auth/me` | Dados do usuario autenticado |
| POST | `/documents/upload` | Upload de documento |
| POST | `/documents/:id/ocr` | Processar OCR |
| POST | `/documents/:id/ask` | Fazer pergunta ao documento |
| GET | `/documents` | Listar documentos do usuario |
| GET | `/documents/:id/download` | Download com anotacoes |
| DELETE | `/documents/:id` | Excluir documento |

---

## Licenca

MIT
