# Documentação do SGV / JrBordados

Fonte única da documentação de backend **e** frontend. Estado verificado no código em 2026-11-13.

## Ordem de leitura

1. [visao-geral.md](visao-geral.md): o que é o produto, para quem, escopo.
2. [GLOSSARY.md](GLOSSARY.md): vocabulário do domínio.
3. [regras-de-ouro.md](regras-de-ouro.md): regras de código do backend (frontend: `../../proj-full-stack-frontend/docs/principios-e-regras-de-ouro.md`).
4. [arquitetura.md](arquitetura.md): como backend e frontend funcionam e se conectam.
5. [funcionalidades.md](funcionalidades.md): o que existe, por módulo, com status.
6. [roadmap.md](roadmap.md): MVP por módulo e fases futuras.
7. [handoff.md](handoff.md): estado atual, dívidas, perguntas abertas, como começar.

## Outros

- [padrao-de-documentacao.md](padrao-de-documentacao.md): como escrever e manter estes docs.
- [como-rodar.md](como-rodar.md): subir banco, backend e frontend.
- [adr/](adr/): decisões de arquitetura. 0001 chave mestre (aceita); 0002 multi-tenant (pendente).

## Mapa por tarefa

| Quero…                                  | Leia                                                          |
| --------------------------------------- | ------------------------------------------------------------- |
| Entender o produto                      | visao-geral, GLOSSARY                                         |
| Criar uma tabela/endpoint novo          | regras-de-ouro §Receita "nova tabela", arquitetura            |
| Mexer em login, master ou permissão     | arquitetura §Autenticação, adr/0001, roadmap módulo Acesso    |
| Pegar a próxima tarefa                  | roadmap, handoff                                              |
| Mexer em telas                          | docs do frontend + arquitetura §Frontend                      |
