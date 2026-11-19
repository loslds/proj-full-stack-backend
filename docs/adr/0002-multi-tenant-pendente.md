# 0002. Multi-tenant: estratégia de isolamento (PENDENTE)

Status: **proposta, não decidida** (2026-11-13). O dono do produto quer isolar só o "extremamente necessário", mas ainda não definiu a estrutura e pediu ajuda para organizar.

## Contexto

Produto SaaS multiempresa. Nenhuma tabela tem coluna de tenant. `empresas` não é o tenant (representa organizações ligadas a cadastros, ex.: a empresa do visitante). Deploy-alvo: Docker em nuvem.

## Direção do dono (2026-11-13)

Cada empresa terá **um DB próprio**, criado na aquisição (opção A). Hoje só roda em loco e a criação de DB ainda não existe; o provisionamento entrará no módulo Config. Esta nota supera a "proposta" B abaixo, mas o ADR segue **pendente** até serem respondidas as perguntas de provisionamento (ver [../dominio/multi-empresa-e-instalacao.md](../dominio/multi-empresa-e-instalacao.md) e, depois do grill, o handoff).

### Refinamento (2026-11-13, Input 12)

Um mesmo DB pode ter **mais de uma empresa** (ex.: uma ME com CNPJ e um MEI, no mesmo prédio, usando o mesmo sistema). Portanto o isolamento do SaaS é **por instalação** (DB), e as **empresas** dentro dela precisam de regra própria de compartilhamento (clientes, usuários, preços, OS). Matriz e filiais **não** se ligam: cada filial é uma empresa independente.

## Opções

| Opção | Isolamento | Custo de mudança |
| ----- | ---------- | ---------------- |
| A. Uma stack/banco por cliente | Total | Nenhuma no schema; custo em operação (N bancos, N deploys) |
| B. Banco compartilhado + `id_tenants` em tabelas operacionais | Por consulta | Média: coluna, filtro obrigatório nos repositories, índices |
| C. Banco compartilhado + `id_tenants` em todas | Por consulta | Alta e pouco proveitosa para tabelas globais |

## Proposta para discussão (não vinculante)

Opção **B**, em duas classes de tabela:

- **Por tenant**: `users`, `logins`, `acessos`, `chaves`, `pergsresps`, `cadastros` e dependentes (`emails`, `docs`, `fones`, `empresas`, `visitantes`, `visitas`, `consumidores`, `clientes`, `fornecedores`, `funcionarios`, `pessoas` se customizadas), e no futuro pedidos.
- **Globais**: `estados`, `cidades`, `modulos`, `acoes`, `imagens` padrão. `cargos`, `servicos`, `grpservicos`, `perguntas`: decidir se cada cliente personaliza.

A tabela `tenants` e o `id_tenants` no JWT entram **depois** do MVP (roadmap fase 5). O MVP segue single-tenant, sem criar código que dificulte a opção A ou B.

## Decisões necessárias do dono do produto

1. Quantos clientes e em que prazo? (poucos → A; muitos → B)
2. Cada cliente personaliza serviços, cargos, perguntas?
3. A chave mestre de suporte vê todos os tenants? (ver [0001](0001-chave-mestre-acesso-de-suporte.md))
4. Imagens e logos por cliente (`userclients`) ficam onde?

Ao decidir, mude o status e registre o resultado aqui.
