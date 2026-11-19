# Domínio: Multiempresa, instalação e abertura do sistema

Status (2026-11-13): direção definida; detalhes em aberto. Decisão formal em [ADR 0002](../adr/0002-multi-tenant-pendente.md) (pendente). `✔` = decisão do dono; `?` = lacuna; `[código]` = verificado.

## Produto e deploy ✔

- Produto **SaaS** para qualquer empresa de bordado e corte a laser que também terceirize outros serviços de confecção. O JrBordados é o primeiro cliente.
- Hoje: **em loco** (`localhost`, Vite, MySQL 8.1 local), em desenvolvimento. Futuro: internet, em provedor com domínio, em **Docker**.
- Cada cliente SaaS terá **um banco próprio**, criado na aquisição. A criação automatizada de banco **ainda não existe**; entrará no **Config** (e valerá para a internet) depois que tudo funcionar.
- **Chave de instalação** única por cliente: adiada ([login-e-acesso.md](login-e-acesso.md)).
- Como o sistema escolhe o banco pelo domínio (empresa1.dominio…): **decisão futura** ✔.

## Várias empresas no mesmo banco ✔

- Um mesmo banco pode ter **mais de uma empresa** (ex.: uma **ME** com CNPJ e um **MEI** com CPF, no mesmo prédio). Por isso a empresa escolhe **PF ou PJ**.
- Nomes fantasia e titulares diferentes (ex.: _Jr Bordados-ME_, CNPJ; _Jr Bordados-MEI_, CPF).
- Cada **cadastro** tem `id_empresas`: empresas **não compartilham** clientes, fornecedores, funcionários e usuários; podem **importar** dados (copiar e editar) ([cadastros.md](cadastros.md)). A **OS é por empresa**.
- **Matriz e filiais não se ligam**: cada filial é uma empresa independente (CNPJ, cadastros, preços próprios). Unir bancos exigiria outro sistema (integração), fora do escopo. Ofertas da matriz para a rede: fase futura.

## Abertura do sistema ✔

1. Executa `localhost:porta`; o frontend recebe do backend **ok ou falha** (com motivo). Se o backend está fora, avisa.
2. O backend tem uma **lista de tabelas** que verifica, checa e/ou cria; dentro dela há uma **lista menor de tabelas com registros default**.
3. A tabela principal que gerencia isso é **`systables`**. Exemplos: `empresas` só é criada; `pessoas` recebe os defaults (1 Pessoa Física `PF`, 2 Pessoa Jurídica `PJ`).
4. Mostra uma lista do que o backend enviou, e libera a **HOME** com os setores.
5. **Regra de cascata**: tabelas com FK dependem de registro-pai (ex.: empresa assume `id_pessoas` conforme o tipo escolhido).
6. O assistente de cadastro da empresa é o primeiro passo da instalação ([cadastros.md](cadastros.md)). Detalhes do que vem depois ficam em aberto, **desenvolvimento iterativo** ✔.

## Verificado no código

- [código] `systemTables` (27 tabelas), `tablesWithDefaults`, `ensureSystemReady`, `systemHealthCheck`; `GET /api/system/init|health|table/:nome`; `systables` guarda `nome`, `chkdb` e mais.
- [código] Nenhuma tabela tem coluna de tenant. `empresas` tem `nome`, `fantasy`, `id_pessoas`, `formhlpemp`; **não** marca "produto e/ou serviço".
- [código] `synchronize: true`; `C:/imagens-sgv` e `localhost` fixos; CORS só `localhost`; `docker-compose.yml` usa `mysql:8` (dev local usa 8.1).

## Lacunas abertas

1. **Provisionamento do banco** (Config): quem cria, como (script, API, painel), onde fica o catálogo de clientes SaaS e conexões ("banco mestre"), como atualizar o schema em N bancos, como a master de suporte vê N bancos.
2. **Empresa × produto/serviço**: onde marcar que vende produto, presta serviço ou ambos? (Não existe no `empresas`.)
3. **Empresa dona × `empresas`**: a primeira empresa é a dona do sistema; fornecedores PJ e outras empresas também ficam em `empresas`? Como distinguir?
4. **`systables`**: campos essenciais; quando uma tabela está ausente, bloqueia ou só avisa (hoje "modo DEV")? Motivos de falha a distinguir na UI (backend fora, banco fora, tabela ausente, seed falhou).
5. **MySQL**: padronizar a versão (8.1 local × `mysql:8`) antes da nuvem. Backup/restauração por empresa (há `BackupDB.tsx`/`RestoreDB.tsx` sem rota).
6. **Isolamento dentro do banco** entre as empresas: filtro obrigatório por `id_empresas` nas consultas e nas listagens (`/api/*` e `/api/grid/*` hoje listam tudo).
7. **Domínio por empresa**: futuro (dono).
8. **Nome do produto**: `piratec.com.br` aparece como domínio de exemplo; hoje o sistema é SGV/JrBordados no código.
