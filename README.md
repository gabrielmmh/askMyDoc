## askMyDoc

Aplicação web que permite o upload de documentos (PDFs ou imagens), realiza OCR automático para extrair o texto e permite que o usuário faça perguntas sobre o conteúdo usando uma IA. As interações e documentos são armazenados e ficam disponíveis em uma interface simples. O acesso exige autenticação via e-mail/senha ou login com Google.

**Deploy:** [ask-my-doc-frontend.vercel.app](https://ask-my-doc-frontend.vercel.app)

---

## Requisitos

Antes de começar, certifique-se de ter:

* Node.js v18 ou superior
* `pnpm` instalado globalmente (`npm install -g pnpm`)
* Um banco de dados PostgreSQL (pode ser local ou na nuvem: Railway, Supabase, Neon, etc.)

---

## Passo 1 – Clone o projeto e instale as dependências

```bash
git clone https://github.com/gabrielmmh/askMyDoc.git
cd askMyDoc
pnpm install
```

---

## Passo 2 – Configure os arquivos `.env`

Você precisa criar **dois arquivos `.env`**: um na raiz e outro dentro de `apps/frontend`.

### 📁 `.env` na raiz:

```env
DATABASE_URL=postgresql://<usuario>:<senha>@<host>:<porta>/<nome_do_banco>
JWT_SECRET=<chave_aleatoria>
OPENROUTER_API_KEY=<sua_chave_da_openrouter>
GOOGLE_CLIENT_ID=<client_id_do_google>
GOOGLE_CLIENT_SECRET=<client_secret_do_google>
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
FRONTEND_URL=http://localhost:3000
PORT=3001
```

Para gerar o `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 📁 `.env` dentro de `apps/frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Passo 3 – Configure as credenciais do Google

1. Acesse [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2. Crie um projeto (se ainda não tiver)
3. Vá até “Tela de consentimento OAuth” e configure como externa
4. Crie uma credencial OAuth 2.0

   * URI de redirecionamento: `http://localhost:3001/auth/google/callback`
5. Copie o **Client ID** e o **Client Secret** e adicione no `.env` da raiz

---

## Passo 4 – Rode as migrações do banco de dados

```bash
pnpm exec prisma migrate dev --schema=packages/prisma/schema.prisma
```

---

## Passo 5 – Inicie o projeto

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

Com isso, o projeto estará disponível em `http://localhost:3000` (frontend) e `http://localhost:3001` (API).
