# Visão geral

## O que é

SGV (nome do banco e da pasta de imagens) para o **JrBordados**: sistema web que acompanha a empresa da porta de entrada à expedição. Serviços da empresa: Design, Bordados, DTF, Adesivo UV, Corte a Laser, Gravação, Silkscreen.

Meta de negócio: **produto SaaS para várias empresas**; o JrBordados é o primeiro cliente.

## Módulos do produto

Cada módulo é uma área da UI com acesso controlado por permissão (seed `modulos`):

| Módulo         | Propósito                                                        |
| -------------- | ---------------------------------------------------------------- |
| Visitante      | Visitante registra entrada/saída e consulta o que lhe é liberado |
| Recepção       | Atendimento: clientes, consumidores, ordens de serviço           |
| Design         | Criação de artes                                                 |
| Produção       | Execução dos serviços                                            |
| Acabamento     | Acabamento das peças                                             |
| Expedição      | Entrega                                                          |
| Administração  | Gestão                                                           |
| Config         | Instalação, cadastros de apoio, usuários, acessos, tabelas       |

Estado de cada módulo: [funcionalidades.md](funcionalidades.md). Ordem de entrega: [roadmap.md](roadmap.md).

## Quem usa

- **Administrador / suporte**: entra com **chave mestre** (sempre disponível, acesso total).
- **Usuário da empresa**: login simples (identificador + senha) com permissão por módulo e ação.
- **Visitante**: pessoa externa que registra visita.

## Ambiente

- Hoje: apenas `localhost`, banco MySQL em Docker.
- Alvo: nuvem, tudo em containers Docker. Veja [handoff.md](handoff.md) §Dívidas para o que impede isso hoje.

## Fora de escopo do MVP

Fluxo de pedidos nos setores Design/Produção/Acabamento/Expedição, preços/linhas, multi-tenant completo. Detalhe em [roadmap.md](roadmap.md).
