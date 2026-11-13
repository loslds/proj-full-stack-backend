# Padrão de documentação

Como escrever os docs deste produto. Leitores: pessoas e agentes. Um agente consegue repetir o mesmo processo sem perguntar, então cada doc diz o que fazer e quando está pronto.

## Estrutura

- `AGENTS.md` (raiz de cada projeto): curto, só ponteiros. `CLAUDE.md` contém apenas `@AGENTS.md`.
- `docs/`: um Markdown por assunto, nome em minúsculas com hífen. Subpasta quando o assunto crescer.
- Fonte única: backend `docs/`. O frontend tem um espelho curto (`docs/README.md`) que aponta para ela, mais seu próprio `principios-e-regras-de-ouro.md`.
- Decisões em `docs/adr/NNNN-titulo.md`. Vocabulário em `docs/GLOSSARY.md`.

## Regras de escrita

1. **Um significado, um lugar.** Não copie texto; aponte com link.
2. **Não repita o que o ambiente já diz.** Scripts ficam em `package.json`, rotas em `routes/`. Documente o que o código não revela: convenção, motivo, armadilha.
3. **Ponteiro com gatilho.** Todo link diz quando seguir: "antes de alterar X, leia Y".
4. **Passos terminam com critério de pronto** verificável ("lista, inclui, altera e exclui no navegador"), não "funcionando".
5. **Positivo.** Diga o que fazer. Reserve NUNCA para guarda-corpos que não têm forma positiva, e junte o que fazer no lugar.
6. **Status honesto.** ✅ só com validação; marque o que foi inferido como "(a confirmar)".
7. **Datas absolutas** (`2026-11-13`), nunca "ontem".
8. **Curto.** Doc que cresce demais é dividido por assunto e ligado pelo índice.
9. **Termos do GLOSSARY** em todo texto, código e commit.

## Tipos de doc

| Tipo       | Pergunta que responde               | Arquivo exemplo |
| ---------- | ----------------------------------- | --------------- |
| Visão      | O que é e para quê?                 | visao-geral.md |
| Referência | Como é? (consulta)                  | arquitetura.md, regras-de-ouro.md |
| Estado     | O que existe e em que pé está?      | funcionalidades.md, handoff.md |
| Plano      | O que fazer e em que ordem?         | roadmap.md |
| Decisão    | Por que foi assim?                  | adr/ |

## Quando atualizar

- Mudou comportamento, rota, tabela ou regra → doc do assunto, no mesmo commit.
- Tarefa do roadmap concluída → marque `[x]`, atualize `funcionalidades.md`.
- Fim de sessão → linha no diário do `handoff.md`.
- Termo novo ou ambíguo → GLOSSARY.
- Decisão difícil de reverter, surpreendente e com alternativa real → ADR.

## Cabeçalho de doc novo

Título, uma frase de propósito, data de verificação quando descrever estado. Adicione-o à tabela de `README.md`.
