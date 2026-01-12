# askMyDoc - Frontend

Interface web do askMyDoc construida com Next.js 15 e React 19.

## Tecnologias

- Next.js 15 (App Router)
- React 19
- TypeScript
- CSS Modules
- Poppins (fonte)

## Estrutura

```
src/
├── app/                    # Rotas do App Router
│   ├── page.tsx           # Pagina principal (/)
│   ├── layout.tsx         # Layout raiz
│   └── auth/
│       ├── login/         # Pagina de login
│       └── register/      # Pagina de registro
├── components/
│   ├── home/
│   │   ├── Header.tsx     # Cabecalho com auth
│   │   ├── UploadForm.tsx # Formulario de upload
│   │   ├── DocumentList.tsx # Lista de documentos
│   │   └── DocumentCard.tsx # Card individual
│   └── auth/
│       ├── LoginForm.tsx  # Formulario de login
│       └── RegisterForm.tsx # Formulario de registro
├── lib/
│   └── api.ts             # Cliente API centralizado
└── styles/
    ├── globals.css        # Estilos globais
    ├── home/              # Estilos da home
    └── auth/              # Estilos de auth
```

## Configuracao

Crie um arquivo `.env` na raiz do frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Comandos

```bash
# Desenvolvimento
pnpm dev

# Build de producao
pnpm build

# Iniciar producao
pnpm start

# Lint
pnpm lint
```

## Funcionalidades

- Upload de PDFs e imagens
- Visualizacao do texto extraido (OCR)
- Chat com IA sobre o documento
- Download do documento com anotacoes
- Autenticacao (email/senha e Google OAuth)
- Interface responsiva
