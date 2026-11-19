# Regras de ouro (backend)

Leitura obrigatória antes de alterar o backend. **NUNCA** e **SEMPRE** não têm exceção sem aprovação do usuário. Frontend: `../../proj-full-stack-frontend/docs/principios-e-regras-de-ouro.md`.

## Princípios

1. **Siga o código vizinho.** Copie o padrão de `use-cases/visita/` ou `pessoa/` antes de inventar outro.
2. **Mudança pequena.** Um objetivo por alteração; sem refatoração misturada com correção.
3. **Nomes de domínio vêm do [GLOSSARY.md](GLOSSARY.md).**
4. **Docs junto do código.** Mudou comportamento, atualize o doc do assunto.

## Princípio do dono

**O servidor processa; o cliente só apresenta.** Validação, busca de duplicidade, filtros (incluindo arquivados e estado → cidade), importação, flags derivadas e regras de papel ficam no backend. O frontend não carrega listas inteiras para filtrar na tela nem decide regra de negócio.

## Regras

- Código novo e arquivos novos em TypeScript estrito; sem `any` novo.
- Pasta de domínio: `use-cases/<singular>/` com `<plural>.entity|dto|validation|repository|controller|route.ts` e `index.ts`.
- Entrada validada com zod nos `*.validation.ts`; erro de negócio com `HttpException(status, mensagem)`; resposta `{ success, ... }`.
- Rotas fixas antes das dinâmicas (`/:id`).
- Toda entidade tem `createdBy/createdAt/updatedBy/updatedAt`.
- **NUNCA** commite `.env`, segredos ou `MASTER_STATIC`; leia de `process.env`.
- **NUNCA** edite `dist/`, `node_modules/` nem `anterior/`.
- **NUNCA** grave caminho absoluto ou `localhost` em código novo; use env/config.
- Rota nova sensível entra atrás do middleware de autenticação assim que ele existir (roadmap módulo Acesso).
- **SEMPRE** `yarn ts:check` e `yarn lint` sem erro novo antes de concluir.

## Receita: nova tabela de domínio

1. Criar `use-cases/<dom>/` (entity, dto, validation, repository, controller, route, index) copiando um vizinho.
2. Registrar a entity em `config/db.ts`.
3. Criar `services/table/<dom>.service.ts` e registrar em `tableServicesRegistry.ts`.
4. Incluir o nome em `systemTables` (e em `tablesWithDefaults` se houver seed em `services/table/seed/`).
5. Montar a rota em `routes/indexRoute.ts`.
6. Se houver listagem na UI: `services/grid/<dom>/`, `services/utility/<dom>/` (SELECT + mapper) e `routes/indexGridRoute.ts`.
7. Atualizar [arquitetura.md](arquitetura.md), [funcionalidades.md](funcionalidades.md) e o GLOSSARY.

## Cuidados conhecidos

- `synchronize: true` altera o schema ao subir. Renomear/remover coluna pode perder dados; confira antes e avise o usuário.
- `ensureSystemReady` roda a cada start e pode mexer em imagens/pasta pública.
