# Arquitetura

## Stack

- **Backend** (`proj-full-stack-backend`): Node, TypeScript, Express 4, TypeORM 0.3, MySQL 8, zod, jsonwebtoken. Porta `5000`. Comandos: `package.json` (`yarn dev`, `yarn build`, `yarn lint`, `yarn ts:check`).
- **Frontend** (`proj-full-stack-frontend`): React 18, Vite, styled-components, react-router 7. Porta `5173`; o proxy `/api` do Vite aponta para `localhost:5000`. Regras: `../../proj-full-stack-frontend/docs/principios-e-regras-de-ouro.md`.
- **Banco**: `docker-compose.yml` sobe `mysql8` e `phpmyadmin` (porta 8080), variáveis em `.env` (não versionado).
- Os dois projetos são repositórios git separados; a raiz `C:\repository` não os versiona.

## Backend: camadas

```text
src/
  index.ts               sobe Express, CORS, rotas, init do banco
  config/                db.ts (DataSource), app.ts (portas), systemPaths.ts
  routes/                indexRoute (monta /api/*), indexGridRoute (/api/grid/*), systemRoutes
  use-cases/<dominio>/   CRUD: entity, dto, validation (zod), repository, controller, route, index
  services/table/        ciclo de vida da tabela: create/count/seed/update (+ seed/*.seed.ts)
  services/grid/         endpoints de listagem para grids da UI (SQL puro)
  services/utility/      SELECT e mapeador de linha de cada grid
  system/, routes/       init, health, leitura genérica de tabela
  utils/                 chave master, segredo JWT diário
  middlewares/           errorHandler (HttpException → JSON)
```

Padrão de `use-cases/<dominio>` (copie `visita/` ou `pessoa/`): `index.ts` exporta rotas e `<dom>Config` (`tableName`, `repoClass`, `findAll`); a rota declara fixas antes de dinâmicas (`/:id`); erros via `HttpException(status, msg)`; respostas `{ success, ... }`.

## Inicialização do sistema

`index.ts` → `AppDataSource.initialize()` (**`synchronize: true`**: o TypeORM altera o schema sozinho) → `ensureSystemReady()` → `systemHealthCheck()` → `listen`.

`ensureSystemReady` percorre `systemTables` (`services/table/tables.ts`): cria a tabela via `tableServicesRegistry`, roda `seed` quando a tabela está em `tablesWithDefaults` e vazia, sincroniza `systables`. `imagens` é caso especial: seed sempre roda (lê ZIPs de `src/assets/arq_zip`, valida, quarentena, descompacta e sincroniza com `C:/imagens-sgv`, servida em `/assets`).

`GET /api/system/init` repete a instalação; `GET /api/system/health` informa o estado; `GET /api/system/table/:nome` lê linhas de qualquer tabela.

## Autenticação (estado atual)

- `POST /api/auth/master` com `{ masterKey }` aceita três formas: data `YYYYMMDD` de hoje, PIN de 4 dígitos derivado da data, ou `MASTER_STATIC` do `.env`. Devolve JWT (1 h, `scope: "master"`) assinado com `JWT_SEED::YYYYMMDD` (o segredo muda por dia).
- **Nenhuma rota valida o JWT.** Não há middleware de autenticação nem de permissão. A API inteira está aberta.
- **Não existe endpoint de login de usuário.** Existem as tabelas `users`, `logins`, `acessos`, `chaves`, `pergsresps` e as telas `Login.tsx`/`Resgate.tsx` (fora das rotas).
- Frontend: estado de acesso em `ContextAcesso` (`chvkey`/`auth_admin` para master; `logado`/`auth` para usuário). `useCanAccess`/`usePageAccess` decidem exibição; é só conveniência. Token master em `localStorage.token_admin`.
- Decisão sobre a master: [adr/0001-chave-mestre-acesso-de-suporte.md](adr/0001-chave-mestre-acesso-de-suporte.md).

## Modelo de dados (resumo)

27 tabelas em `systemTables`. Colunas de auditoria em quase todas: `createdBy`, `createdAt`, `updatedBy`, `updatedAt`.

- **Identidade**: `pessoas` (tipo: sigla) → `cadastros` (um registro por papel: aponta para `empresas`, `visitantes`, `consumidores`, `clientes`, `fornecedores`, `funcionarios`, `cidades`, `imagens`) com contatos em `emails`, `docs`, `fones`.
- **Acesso**: `users` (→ `cadastros`), `logins` (sessões), `acessos` (permissões por módulo/cargo/ação), `chaves` (identificador + hash), `pergsresps` (resposta às `perguntas`, para resgate).
- **Domínio de apoio (seeds)**: `modulos`, `cargos`, `acoes` (níveis de permissão com cor), `perguntas`, `estados`, `cidades`, `servicos`, `grpservicos`, `imagens`.
- **Operação**: `visitantes` (→ `empresas`, `pessoas`), `visitas` (entrada/saída, tempo). `codsegs` tem entidade e rotas, mas não está em `systemTables`.
- **Não existe** modelo de pedido/ordem de serviço, preço ou linha de produto.

Termos: [GLOSSARY.md](GLOSSARY.md).

## Frontend: como se liga

- Rotas só em `src/routeList.tsx`. Ativas: `/` (Home), `/modulos/visitante`, `/modulos/config`, `/cards/desenvolver`. Os demais módulos, `Login` e `Resgate` estão comentados.
- Fluxo da Home: checa banco (`api/db/*`), pede chave master (`api/auth/masterLogin.ts`), navega ao módulo.
- Cada domínio tem `components/pages/cad<dominio>/` com Inc/Alt/Exc/List/Pesq, um layout em `components/layouts` e um header em `components/hearders/headers`. Listagens usam `GenericGrid` + `useTableData` contra `/api/grid/*` ou `/api/system/table/*`.
- Assets: ícones, avatares e painéis vêm do backend (`/assets`, zips em `src/assets/arq_zip`) e também há cópias em `frontend/src/assets`.

## Rotas da API

Todas sob `/api`: `/system`, `/auth`, um recurso por use-case (`/pessoas`, `/visitas`, …) e `/grid/<recurso>` para listagens. Em `/grid`, `servicos` e `grpservicos` não estão montados. Lista completa: `src/routes/indexRoute.ts` e `src/routes/indexGridRoute.ts`.
