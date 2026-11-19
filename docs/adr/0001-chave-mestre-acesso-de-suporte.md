# 0001. Chave mestre como acesso de suporte permanente

Status: aceita (2026-11-13), decisão do dono do produto.

## Contexto

Antes de existir qualquer usuário o sistema precisa ser instalado e configurado. A chave mestre resolve isso. Existe login de usuário simples para o uso diário.

## Decisão

A chave mestre **continua válida depois** que existirem usuários, com acesso total de suporte. Usuários comuns entram por login (identificador + senha) com permissão por módulo e ação.

## Alternativas descartadas

- Master só até o 1º administrador existir.
- Master restrita à Config/sistema.
- Master desligável por variável de ambiente.

## Consequências

- Em nuvem, vazamento de `MASTER_STATIC`, `JWT_SEED` ou da regra data/PIN (previsível) dá acesso total a todos os clientes. Pendente de tratamento antes do deploy: rotação, rate limit, auditoria de uso e, se necessário, revisar esta decisão.
- Toda rota protegida aceita master **ou** usuário com permissão (roadmap módulo Acesso).
- Registrar cada uso da master em `logins`/log é recomendável.
