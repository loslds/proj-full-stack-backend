# Glossário

Vocabulário do domínio. Só termos e significados; implementação fica em outros docs. Termos marcados **(a confirmar)** foram inferidos do código.

**Master / Chave mestre**
Credencial de suporte com acesso total, sempre disponível. Aceita: data de hoje `YYYYMMDD`, PIN de 4 dígitos do dia ou chave fixa.
_Evitar_: "admin" para designar a master (Administrador é um cargo).

**Usuário**
Pessoa com login (identificador e senha) que acessa módulos conforme suas permissões. Vinculado a um Cadastro.

**Cadastro**
Ficha de uma pessoa ou empresa em um papel (visitante, consumidor, cliente, fornecedor, funcionário). Agrupa contatos (e-mails, documentos, fones), endereço e imagem.

**Pessoa (tipo)**
Classificação do cadastro, com sigla (ex.: física, jurídica) **(a confirmar)**.

**Empresa**
Organização relacionada a um cadastro (por exemplo, de onde vem o Visitante). Não é o cliente SaaS.

**Tenant**
Empresa que contrata o produto SaaS. Ainda não modelado no banco.

**Visitante**
Pessoa externa que registra visitas.

**Visita**
Evento com entrada, saída e tempo de permanência de um Visitante. Só uma visita aberta por Visitante.

**Consumidor / Cliente / Fornecedor / Funcionário**
Papéis de um Cadastro. Diferença exata entre Consumidor e Cliente: **(a confirmar)**.

**Módulo**
Área funcional da UI: Visitante, Recepção, Design, Produção, Acabamento, Expedição, Administração, Config.

**Cargo**
Nível funcional: Junior, Pleno, Senior, Supervisor, Administrador.

**Ação (nível de permissão)**
Degrau cumulativo de permissão com cor: Visualização → Listagem → Inclusão → Alteração → Exclusão. Cada Acesso concede uma Ação num Módulo.

**Acesso**
Permissão de um Usuário: combinação de Módulo, Cargo e Ação.

**Login (sessão)**
Registro de entrada e saída de um Usuário no sistema, com tempo total.

**Chave**
Credencial do Usuário (identificador e hash da senha).

**Resgate**
Recuperação de acesso respondendo às Perguntas secretas cadastradas.

**Pergunta / Resposta**
Pergunta secreta padrão (seed) e a resposta do Usuário, usadas no Resgate. Futuro, fora do MVP.

**Serviço / Grupo de serviço**
Tipo de trabalho oferecido (Design, Bordados, DTF…) e seu agrupamento (material e origem: empresa ou cliente).

**Ordem de serviço (OS)**
Pedido de trabalho de um Cliente. Ainda não modelada.

**Grid**
Listagem tabular da UI alimentada por `/api/grid/*`.

**Seed**
Dados padrão inseridos ao criar uma tabela vazia.

**Quarentena**
Pasta onde vão arquivos de imagem rejeitados na validação dos ZIPs.

**Init (instalação)**
Rotina que cria tabelas, aplica seeds e sincroniza imagens.

**LEVE / DEV / PROD**
Modos de estado do sistema reportados pelo health check.
