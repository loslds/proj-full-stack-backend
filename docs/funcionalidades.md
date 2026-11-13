# Funcionalidades

Legenda: ✅ implementado · 🟡 parcial · ⬜ não iniciado. Verificado no código em 2026-11-13; **nada foi testado ponta a ponta**, então ✅ significa "código existe", não "validado". Cada item, quando entregue, ganha o link do teste/validação.

## Plataforma (Instalação + Master + Config)

| Funcionalidade                                  | Status | Onde |
| ----------------------------------------------- | ------ | ---- |
| Subir MySQL em Docker                           | ✅ | `docker-compose.yml` |
| Criar tabelas e seeds ao iniciar                | ✅ | `services/ensuresSystemReady.ts` |
| Health check e checagem de tabelas              | ✅ | `/api/system/health`, `systemHealthCheck.ts` |
| Importar e servir imagens (ZIP → pasta pública) | ✅ | `services/table/imagens.service.ts`, `/assets` |
| Login com chave mestre                          | ✅ | `use-cases/auth`, `api/auth/masterLogin.ts` |
| Tela Home com checagem de banco e master        | ✅ | `pages/Home.tsx` |
| Tela Config com cadastros de apoio              | 🟡 | `pages/modulos/Config.tsx` (verificar quais cadastros abrem) |
| Backup/restore/explorador de banco              | 🟡 | `BackupDB.tsx`, `RestoreDB.tsx`, `ExplorerDB.tsx` (sem rota) |
| Proteção das rotas da API por token             | ⬜ | — |

## Acesso (Usuários + permissões)

| Funcionalidade                                       | Status | Onde |
| ---------------------------------------------------- | ------ | ---- |
| Tabelas users, logins, acessos, chaves, cargos, ações | ✅ | `use-cases/*`, seeds |
| CRUD REST dessas tabelas                             | ✅ | `/api/users`, `/api/acessos`… |
| Telas de cadastro (Inc/Alt/Exc/List/Pesq)            | 🟡 | `pages/caduser`, `cadacesso`, `cadchave`, `acaoes` (sem rota) |
| Endpoint de login de usuário                         | ⬜ | — |
| Middleware de autenticação e permissão               | ⬜ | — |
| Tela de Login                                        | 🟡 | `pages/Login.tsx` (comentada em `routeList`) |
| Resgate por perguntas                                | ⬜ | `Resgate.tsx` existe; fora do MVP |

## Visitante + Recepção

| Funcionalidade                                      | Status | Onde |
| --------------------------------------------------- | ------ | ---- |
| CRUD de visitantes, empresas, pessoas, cadastros    | ✅ | `use-cases/*` |
| Entrada/saída de visita, contagem e tempo           | ✅ | `use-cases/visita` |
| Cadastros de contato (emails, docs, fones, CEP)     | ✅ | `use-cases/{email,doc,fone}`, `routes/cepRoutes.ts` |
| Módulo Visitante na UI                              | 🟡 | `pages/modulos/Visitante.tsx` (roteado) |
| Módulo Recepção na UI                               | 🟡 | `pages/modulos/Recepcao.tsx` (stub; páginas comentadas) |
| CRUD de clientes, consumidores, fornecedores, funcionários | ✅ backend / 🟡 telas | `pages/cad*` sem rota |

## Design / Produção / Acabamento / Expedição / Administração

| Funcionalidade                         | Status | Observação |
| -------------------------------------- | ------ | ---------- |
| Páginas dos módulos                    | 🟡 | Stubs de ~100 linhas, sem rota |
| Serviços e grupos de serviço (cadastro)| ✅ | `/api/servicos`, `/api/grpservicos` (sem `/grid`) |
| Ordem de serviço / pedido              | ⬜ | Sem modelo de dados |
| Tabelas de preço e linhas              | ⬜ | `pages/tabela/{linha,preco}` vazios |
| Fluxo entre setores                    | ⬜ | — |

## Transversais futuros

Multi-tenant, deploy em nuvem/Docker completo, testes automatizados, CI: ver [roadmap.md](roadmap.md).
