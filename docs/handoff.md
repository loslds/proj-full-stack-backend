# Handoff

Estado em **2026-11-18**. Atualize ao fim de cada sessão de trabalho (data, o que mudou, o que ficou).

## Estado

- Backend: CRUD completo para 27 tabelas, init/seed, health, imagens, master key. `tsc --noEmit` passa sem erros (verificado 2026-11-18); execução em runtime não reverificada.
- Frontend: telas CRUD existem para quase todos os domínios, mas só `Home`, `Visitante` e `Config` estão roteados.
- Segurança: **a API não valida token em nenhuma rota.** Prioridade do MVP (roadmap módulo 2).
- Git: backend e frontend têm repositórios próprios; ambos têm alterações não commitadas. A raiz `C:\repository` não versiona os projetos. Commits antigos usam mensagens do tipo data (`26-08-26`).

**Atenção:** a visão do dono (2026-11-13) está em [dominio/](dominio/README.md) e **corrige** partes deste handoff e do roadmap (Visitante é vitrine anônima; Design é setor; várias empresas por banco; mesma pessoa com vários papéis). Em conflito, vale `dominio/`.

## Como começar (nova pessoa/agente)

1. Leia `README.md`, `visao-geral.md`, `GLOSSARY.md`.
2. Siga [como-rodar.md](como-rodar.md).
3. Pegue uma tarefa aberta do [roadmap.md](roadmap.md), na ordem dos módulos.
4. Leia o doc do assunto, siga a regra de ouro correspondente, entregue mudança pequena.
5. Ao terminar: atualize `funcionalidades.md`/`roadmap.md` e este arquivo.

## Dívidas conhecidas

- Sem autenticação nas rotas; sem login de usuário no backend.
- `synchronize: true` no TypeORM.
- `C:/imagens-sgv` fixo em `config/systemPaths.ts`; CORS só `localhost`; `appPort` fixo em 5000.
- `http://localhost:5000` fixo em `src/api/api.ts`, `Home.tsx`, `Config.tsx`, `InstallSys.tsx`.
- `index.ts` imprime se `MASTER_STATIC` carregou e usa `any` no handler da porta.
- `.env` do backend contém segredos reais locais: nunca commitar; criar `.env.example`.
- Pastas legado: `proj-full-stack-backend/anterior`, `backup-frontend-20260615`, `frontend/rascunhos`, arquivos `.bck`: não apague sem aprovação.
- `servicos`/`grpservicos` sem rota `/grid`; `codsegs` com entity/rotas mas fora de `systemTables`; `grpmanufaturas.seed.ts` sem uso aparente.
- Nomes legados com grafia errada no frontend (`hearders`, `boockList`, `useCanAcess`) são mantidos.
- Duas cópias de ícones/painéis (backend `src/assets` e frontend `src/assets`).
- Sem testes automatizados nem CI.

## Perguntas abertas (precisam do dono do produto)

1. **Multi-tenant**: estrutura e tabelas por tenant ainda não definidas; o dono pediu ajuda para organizar. Proposta e perguntas em [adr/0002-multi-tenant-pendente.md](adr/0002-multi-tenant-pendente.md). Não bloqueia o MVP (single-tenant).
2. Papel exato de cada módulo (Design, Produção, Acabamento, Expedição, Administração) e do Visitante: descrições em `visao-geral.md` foram inferidas.
3. Diferença entre Consumidor e Cliente. (Sigla em Pessoa: decidido em 2026-11-18, é PF/PJ para listar nome + sigla.)
4. Como o Visitante autentica (usa master/login ou fluxo próprio sem login)?
5. A master tem expiração/rotação definida para nuvem (hoje: data do dia, PIN, chave fixa em env)?
6. Modelo da Ordem de Serviço (necessário só na fase 2).

## Decisões do dono do produto (2026-11-13)

- Produto SaaS multiempresa; JrBordados é o primeiro cliente.
- MVP = Plataforma, Acesso, Visitante+Recepção, descrito por módulo; o resto no roadmap.
- Login de usuário simples + chave mestre **sempre disponível** como suporte com acesso total.
- Hoje localhost + Docker; destino nuvem + Docker.
- Multi-tenant só nas tabelas extremamente necessárias (lista pendente).
- Docs em cada projeto, com fonte única no backend e espelho curto no frontend.

## Diário

| Data | Quem | O que mudou | O que falta |
| ---- | ---- | ----------- | ----------- |
| 2026-11-13 | Claude | Criada a documentação inicial (`docs/`, AGENTS.md, CLAUDE.md) a partir da leitura do código. Nada executado ou testado. | Validar o doc rodando o sistema; responder perguntas abertas. |
| 2026-11-18 | Lindsay + Claude | Commit `40cc3c5`: migração do ESLint (`eslint.config.cjs`, scripts `lint` sem `--ext`), `copy-assets` sem `cpx`, `ServicosEntity`/`GrpServicosEntity` registradas em `db.ts`, rotas `/grid` de servicos/grpservicos comentadas em `indexGridRoute.ts`, ajustes de lint nos services. `tsc --noEmit` ok. Retomado o plano: fechar decisões de cadastros que bloqueiam o login (FK com valor 0, Usuário papel ou acesso, `id_pessoas` do Consumidor) e depois autenticar as rotas. | Autenticação das rotas; decisões restantes de `dominio/cadastros.md`; atualizar a dívida de servicos/grpservicos (entities agora registradas, rotas `/grid` ainda desligadas). |
