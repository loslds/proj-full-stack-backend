# Domínio: Login e acesso

Status (2026-11-13): captura parcial; **grill depois de Cadastros**. `✔` = decisão do dono; `?` = lacuna; `[código]` = verificado.

## Decisões do dono

- O sistema se divide em acessos conforme a necessidade do usuário, por **liberação de senha** ✔. Segue os trâmites conforme o login.
- **Login simples** (identificador + senha) para usuários ✔.
- **Chave-master permanece sempre**, com acesso total de suporte ✔ ([ADR 0001](../adr/0001-chave-mestre-acesso-de-suporte.md)).
- Há também a ideia de a **senha-master** liberar um usuário "conforme a necessidade" ✔ (interpretação em aberto, ver `?`).
- **Chave de instalação**: licença única por cliente que compra ou aluga; **conceito separado** da master; tratada só **depois do projeto pronto** ✔.
- **Resgate** = recuperação de acesso do usuário que esqueceu a senha, por **e-mail e WhatsApp** conforme o cadastro ("como no Windows") ✔.
- Usuário pertence **a uma só empresa** (FK); os acessos vinculam-se ao seu **cadastro** ✔.
- Os dados do login vão para o **`ContextAcesso.ts` / `AcessoProvider`**, que disponibilizam o que o usuário precisa para trafegar ✔.
- A HOME mostra os setores; a rotina de cada setor é acessada pela master e/ou por usuários logados com permissão; **só o Visitante dispensa bloqueio** ✔.

## Verificado no código

- [código] `POST /api/auth/master` aceita data `YYYYMMDD`, PIN de 4 dígitos derivado da data ou `MASTER_STATIC`; emite JWT de 1 h assinado com `JWT_SEED::YYYYMMDD`.
- [código] **Nenhuma rota valida o token**; **não existe endpoint de login de usuário**. As tabelas `users`, `logins`, `acessos`, `chaves`, `pergsresps`, `perguntas` e as telas `Login.tsx`/`Resgate.tsx` existem, mas `Login`/`Resgate` estão comentados em `routeList.tsx`.
- [código] `users` → `cadastros` (`id_cadastros`); **não tem `id_empresas`** (vínculo à empresa só indireto). `logins` registra entrada/saída/minutos. `chaves` guarda identificador e hash (`psw_hash`, `min_hash`).
- [código] `ContextAcesso.ts` tem flags de tela (`logado`, `chvkey`, `inctable`…), tokens (`auth`, `auth_admin`) e já tem `id_emp`, `id_cli`, `id_con`, `id_for`, `id_fun`, `id_user`, `id_logo_emp`, `id_img_user`.
- [código] Resgate hoje usa **perguntas secretas** (`pergsresps`); não há envio de e-mail/WhatsApp.

## Lacunas abertas

1. **Master**: é só suporte (acesso total) ou também uma **autorização** que o usuário digita para liberar uma rotina? Master e Setores são formas paralelas?
2. **Em nuvem** a master é previsível (data/PIN do dia). Rotação, limite de tentativas e registro de cada uso? (ADR 0001.)
3. **Resgate por e-mail/WhatsApp**: provedor, custo, consentimento; perguntas secretas continuam como segunda via? Entra no MVP ou depois?
4. **Primeiro usuário** de cada empresa: quando e por quem é criado? O fim do assistente da empresa inclui isso? A partir daí a master deixa de ser a única forma de entrar (ela permanece como suporte).
5. **Funcionário → usuário**: um cadastro de funcionário gera um `users`? Usuário é papel ou acesso do Funcionário?
6. **Vínculo usuário → empresa**: basta `users → cadastros → empresas` ou precisa `id_empresas` direto? Um usuário opera em mais de uma empresa do mesmo banco?
7. **Quem preenche o contexto** (`id_emp`, `id_user`…) hoje? Deve vir do login do backend. Falta `id_cadastros` do usuário?
8. **Permissões**: `acessos` combina módulo + cargo + ação (níveis cumulativos Vis → Lista → Inc → Alt → Exc). Aplicar no backend (middleware) e não só no frontend.
9. **Visitante** pelo e-mail, na internet: futuro ([vitrine-visitante.md](vitrine-visitante.md)).
10. **Chave de instalação**: o que libera, expiração, validação online ou offline. Só deixar ponto de encaixe; não projetar agora.
