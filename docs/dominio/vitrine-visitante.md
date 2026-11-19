# Domínio: Visitante e vitrine

Status (2026-11-13): captura concluída; o cadastro de Visitante é **futuro** (fora do MVP). `✔` = decisão do dono; `?` = lacuna; `[código]` = verificado.

## Decisões do dono ✔

- **Visitante** não tem acesso ao sistema: vê uma **síntese** do que o sistema faz, com exemplos e informações do momento. É o único setor **sem bloqueio**, pois não há como entrar no sistema por ali.
- A **vitrine** mostra imagens de **trabalhos já executados** pela empresa que **não têm registro próprio**. Na **OS**, o **cliente aceita ou não** a exibição, em respeito às **grifes**/marcas. Só aparece o autorizado.
- O Visitante só será **registrado em `cadastros`** quando o sistema estiver **na internet**: por segurança pedirá o **e-mail** para acesso **depois** de explorar o sistema, e isso permitirá enviar folders, e-mail e WhatsApp. **Próximo futuro**, fora do MVP.

## Verificado no código

- [código] Backend implementa **`visitas`** (entrada, saída, tempo, contagem por visitante) e `visitantes` (empresa, pessoa, nome, fantasy). `Visitante.tsx` está roteado em `/modulos/visitante` com permissões. Isso descreve **controle de visita presencial**, diferente da vitrine pública sem cadastro.
- [código] `imagens` + ZIPs importados, servidos em `/assets` (`userclients/ft|lg`).

## Lacunas abertas

1. **`visitas`/`visitantes` existentes**: ficam **parados** no MVP ou viram **contagem anônima de acessos** à vitrine? O roadmap atual (módulo "Visitante + Recepção") fala em "cadastro → entrada → saída" e **precisa ser reescrito**.
2. **Consentimento de exibição**: campo da OS (sim/não) ou por imagem? Quem pergunta e quando (abertura na Recepção)? Revogável? Vale para **orçamento sem serviço**? A imagem é a foto do produto pronto ou a arte do Design?
3. **Vitrine**: curadoria (alguém escolhe destaques) ou automática? Marca d'água? Quem oculta uma imagem? Onde armazena?
4. **Visitante na internet (futuro)**: e-mail como acesso, verificação, consentimento (LGPD), provedor de envio.
5. O **Visitante** coexiste com outro papel quando for cadastrado?
