# Como rodar (desenvolvimento local)

Status: derivado do código em 2026-11-13, **ainda não executado do zero**. Quem validar, corrija aqui.

Pré-requisitos: Node, Yarn, Docker. Windows: o backend usa `C:/imagens-sgv` (ver `config/systemPaths.ts`; a criação automática da pasta não foi verificada).

1. **Backend** (`proj-full-stack-backend`):
   - Crie `.env` com `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_ROOT_PASSWORD`, `MASTER_STATIC`, `JWT_SEED` (use o seu; nunca commite). O `docker-compose.yml` lê as variáveis `DB_*`.
   - `docker compose up -d` (MySQL 8 e phpMyAdmin em `localhost:8080`).
   - `yarn` e `yarn dev` → porta 5000. No primeiro start o sistema cria tabelas e seeds.
   - Conferir: `GET http://localhost:5000/api/system/health`.
2. **Frontend** (`proj-full-stack-frontend`): `yarn` e `yarn dev` → `http://localhost:5173` (o Vite repassa `/api` ao backend).
3. **Entrar**: Home → chave mestre (data `YYYYMMDD` de hoje, PIN do dia ou `MASTER_STATIC`).

Antes de entregar: `yarn ts:check` e `yarn lint` (backend); `yarn lint` e `yarn build` (frontend).
