## askMyDoc

Aplicação web que permite o upload de documentos (PDFs ou imagens), realiza OCR automático para extrair o texto e permite que o usuário faça perguntas sobre o conteúdo usando uma IA. As interações e documentos são armazenados, e ficam disponíveis em uma interface simples. O acesso exige autenticação por e-mail/senha ou login com Google.

---

## Como rodar o projeto localmente

Este repositório é um monorepo gerenciado com `pnpm`, contendo:

* **Frontend** em Next.js
* **Backend** em NestJS
* **Banco de dados** PostgreSQL, acessado via Prisma ORM

### Pré-requisitos

* Node.js (v18 ou superior)
* `pnpm` instalado globalmente (`npm install -g pnpm`)
* Banco de dados PostgreSQL local ou em nuvem (Railway, Supabase, Neon, etc.)

---

### 1. Configurar variáveis de ambiente

São necessários **dois arquivos `.env`**.

#### `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://<usuario>:<senha>@<host>:<porta>/<nome_do_banco>
JWT_SECRET=<chave_aleatoria>
OPENROUTER_API_KEY=<sua_chave_da_openrouter>
GOOGLE_CLIENT_ID=<client_id_google>
GOOGLE_CLIENT_SECRET=<client_secret_google>
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
FRONTEND_URL=http://localhost:3000
PORT=3001
```

Para gerar o `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### `.env` dentro de `apps/frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### 2. Instalar dependências e rodar migrações

Clone o repositório, instale as dependências e aplique as migrações do Prisma:

```bash
git clone https://github.com/seu-usuario/askMyDoc.git
cd askMyDoc
pnpm install

pnpm exec prisma migrate dev --schema=packages/prisma/schema.prisma
```

---

### 3. Rodar o projeto

Abra dois terminais:

**Terminal 1 (backend):**

```bash
pnpm --filter backend dev
```

**Terminal 2 (frontend):**

```bash
pnpm --filter frontend dev
```

Ou rode ambos ao mesmo tempo:

```bash
pnpm dev:all
```

---

### 4. Criar credenciais OAuth no Google

1. Acesse: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2. Crie um projeto (se necessário).
3. Configure a "Tela de consentimento OAuth" como externa.
4. Crie uma credencial OAuth 2.0 com:

   * URI de redirecionamento: `http://localhost:3001/auth/google/callback`
5. Copie o **Client ID** e o **Client Secret** e coloque no `.env`.

---

## Acesso online

Você pode acessar a aplicação diretamente em produção aqui:

👉 [https://ask-my-doc-frontend.vercel.app](https://ask-my-doc-frontend.vercel.app)
