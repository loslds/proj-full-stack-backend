
// C:\repository\proj-full-stack-backend\src\services\table\imagens.service.ts

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

import { AppDataSource } from '../../config/db';
import { SYSTEM_PATHS } from '../../config/systemPaths';

let createLogged = false;
let countLogged = false;

// ============================================================
// * TYPES *
// ============================================================

type ImagemTipo = 'avatar' | 'botao' | 'foto' | 'logo' | 'painel' | 'img';

type ImagemRegistro = {
  nome: string;
  tipo: ImagemTipo;
  path_origem: string;
  path_dest: string;
  public_url: string;
  svg: string;
  createdBy: number;
  updatedBy: number;
};

type ImagemDbRow = {
  id: number;
  nome: string;
  tipo: string;
  path_origem: string | null;
  path_dest: string | null;
  public_url: string | null;
  svg: string;
};

type SeedItemErro = {
  arquivo: string;
  origem?: string;
  destino?: string;
  motivo: string;
};

type SeedListas = {
  zip_lidos: string[];
  zip_autorizados: string[];
  zip_rejeitados: string[];

  defaults_avt: string[];
  defaults_btn: string[];
  defaults_ft: string[];
  defaults_lg: string[];
  defaults_pnl: string[];
  ft_cli: string[];
  lg_cli: string[];

  quarentena: string[];
  banco_insert: string[];
  banco_update: string[];

  servidor_para_terminal: string[];
  banco_para_servidor: string[];

  pastas_criadas: string[];
  pastas_existentes: string[];
  erros: string[];
};

type SeedResultado = {
  validos: ImagemRegistro[];
  rejeitados: SeedItemErro[];
  erros: SeedItemErro[];
  listas: SeedListas;
};

type UpdateResultado = {
  sincronizadosNoBanco: number;
  exportadosNoDisco: number;
  erros: SeedItemErro[];
};

type ClassificacaoArquivo = {
  valido: boolean;
  tipo: ImagemTipo;
  destinoServidor: string;
  destinoTerminal: string;
  lista: keyof SeedListas;
  motivo?: string;
};

type PastaPar = {
  lista: keyof SeedListas;
  servidor: string;
  terminal: string;
};



// ============================================================
// * SERVICE *
// ============================================================

export const imagensService = {
  tableName: 'imagens',

  // ============================================================
  // * PASSO 1 - CONNECTION *
  // Garante conexão com o banco de dados.
  // ============================================================
  async ensureConnection(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  },

  // ============================================================
  // * PASSO 1 - CREATE TABLE *
  // Verifica se a tabela imagens existe; se não existir, cria.
  // ============================================================
  async create(): Promise<void> {
    await this.ensureConnection();

    if (!createLogged) {// console.log(`>>> [${this.tableName}Service] Iniciado`);
      createLogged = true;
    }

    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS imagens (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

        nome VARCHAR(180)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        tipo VARCHAR(30)
          NOT NULL
          COLLATE utf8mb4_general_ci,

        path_origem VARCHAR(255)
          NULL
          COLLATE utf8mb4_general_ci,

        path_dest VARCHAR(255)
          NULL
          COLLATE utf8mb4_general_ci,

        public_url VARCHAR(255)
          NULL
          COLLATE utf8mb4_general_ci,

        svg LONGTEXT
          NOT NULL
          COLLATE utf8mb4_general_ci,

        createdBy INT UNSIGNED
          NOT NULL
          DEFAULT 0,

        createdAt DATETIME
          DEFAULT CURRENT_TIMESTAMP,

        updatedBy INT UNSIGNED
          NOT NULL
          DEFAULT 0,

        updatedAt DATETIME
          DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,

        UNIQUE KEY uk_imagens_nome (nome),
        INDEX idx_imagens_tipo (tipo),
        INDEX idx_imagens_public_url (public_url)
      )
    `);
  },

  // ============================================================
  // * COUNT *
  // Conta registros persistidos.
  // ============================================================
  async count(): Promise<number> {
    await this.ensureConnection();

    const result = await AppDataSource.query(`
      SELECT COUNT(*) AS total
      FROM imagens
    `);

    const total = Number(result?.[0]?.total ?? 0);

    if (!countLogged) {
      console.log(`>>> [${this.tableName}Service] total de registros:`, total);
      countLogged = true;
    }

    return total;
  },

  // ============================================================
  // * SEED *
  // Processo principal exposto passo a passo.
  // ============================================================
  async seed(): Promise<SeedResultado> {
    const resultado = this.criarEstruturaResultado();

    try {
      this.logStep(1, 'Verificando conexão e tabela imagens');
      await this.ensureConnection();
      await this.create();
      this.logOk(1, 'Tabela imagens pronta');

      this.logStep(2, 'Verificando pastas do servidor');
      this.passo02VerificarPastasServidor(resultado);
      this.logOk(2, 'Pastas do servidor verificadas');

      this.logStep(3, 'Verificando pastas do terminal-client');
      this.passo03VerificarPastasTerminalClient(resultado);
      this.logOk(3, 'Pastas do terminal-client verificadas');

      this.logStep(4, 'Limpando staging e quarentenas da sessão');
      this.passo04LimparTemporarios(resultado);
      this.logOk(4, 'Pastas temporárias limpas');

      this.logStep(5, 'Baixando tabela imagens para src/assets');
      await this.passo05BaixarBancoParaServidor(resultado);
      this.logOk(5, `Banco baixado para servidor: ${resultado.listas.banco_para_servidor.length}`);

      this.logStep(6, 'Localizando ZIPs em src/assets/arq_zip');
      const zipFiles = this.passo06ListarZips(resultado);
      this.logOk(6, `ZIPs encontrados: ${zipFiles.length}`);

      this.logStep(7, 'Descompactando ZIPs autorizados');
      this.passo07DescompactarZips(zipFiles, resultado);
      this.logOk(7, `ZIPs autorizados: ${resultado.listas.zip_autorizados.length}`);

      this.logStep(8, 'Classificando arquivos extraídos');
      this.passo08ClassificarEMoverArquivos(zipFiles, resultado);
      this.logOk(8, `Arquivos válidos classificados: ${resultado.validos.length}`);

      this.logStep(9, 'Persistindo registros válidos na tabela imagens');
      await this.passo09PersistirBanco(resultado);
      this.logOk(9, `Banco insert=${resultado.listas.banco_insert.length} update=${resultado.listas.banco_update.length}`);

      this.logStep(10, 'Movendo sobras de src/assets/img para quarentena');
      this.passo10MoverSobrasParaQuarentena(resultado);
      this.logOk(10, `Quarentena: ${resultado.listas.quarentena.length}`);

      this.logStep(11, 'Copiando src/assets para C:/imagens-sgv');
      const totalCopiados = this.passo11EspelharServidorParaTerminal(resultado);
      this.logOk(11, `Arquivos copiados para terminal-client: ${totalCopiados}`);

      this.logStep(12, 'Exibindo listas finais');
      this.passo12MostrarListas(resultado);

      console.info(
        `[RESUMO][IMAGENS] validos=${resultado.validos.length} | rejeitados=${resultado.rejeitados.length} | erros=${resultado.erros.length} | copiados_terminal=${totalCopiados}`
      );

      return resultado;
    } catch (error: any) {
      const motivo = error?.message ?? 'erro desconhecido';

      resultado.erros.push({
        arquivo: 'seed',
        motivo
      });

      resultado.listas.erros.push(`seed | ${motivo}`);
      console.error(`[ERRO][IMAGENS] seed | ${motivo}`);
      this.passo12MostrarListas(resultado);

      return resultado;
    }
  },

  // ============================================================
  // * UPDATE *
  // Atualiza banco a partir das pastas do servidor e espelha terminal.
  // ============================================================
  async update(): Promise<UpdateResultado> {
    await this.ensureConnection();
    await this.create();

    const resultado = this.criarEstruturaResultado();
    const erros: SeedItemErro[] = [];

    let sincronizadosNoBanco = 0;
    let exportadosNoDisco = 0;

    try {
      console.info('[PASSO UPDATE 1] Verificando pastas');
      this.passo02VerificarPastasServidor(resultado);
      this.passo03VerificarPastasTerminalClient(resultado);

      console.info('[PASSO UPDATE 2] Sincronizando servidor com banco');
      for (const par of this.getParesOperacionais()) {
        sincronizadosNoBanco += await this.syncFolderWithDatabase(par.servidor, resultado);
      }

      console.info('[PASSO UPDATE 3] Espelhando servidor para terminal-client');
      exportadosNoDisco = this.passo11EspelharServidorParaTerminal(resultado);

      this.passo12MostrarListas(resultado);

      console.info(
        `[RESUMO] update | banco=${sincronizadosNoBanco} | terminal=${exportadosNoDisco}`
      );

      return { sincronizadosNoBanco, exportadosNoDisco, erros };
    } catch (error: any) {
      const motivo = error?.message ?? 'erro desconhecido';

      erros.push({
        arquivo: 'update',
        motivo
      });

      console.error(`[ERRO] update | ${motivo}`);

      return { sincronizadosNoBanco, exportadosNoDisco, erros };
    }
  },

  // ============================================================
  // * PASSO 2 *
  // Verifica pastas do servidor.
  // ============================================================
  passo02VerificarPastasServidor(resultado: SeedResultado): void {
    const dirs = [
      SYSTEM_PATHS.SERVER_ZIP_SOURCE,

      SYSTEM_PATHS.SERVER_DEFAULTS,
      SYSTEM_PATHS.SERVER_DEFAULT_AVT,
      SYSTEM_PATHS.SERVER_DEFAULT_BTN,
      SYSTEM_PATHS.SERVER_DEFAULT_FT,
      SYSTEM_PATHS.SERVER_DEFAULT_LG,
      SYSTEM_PATHS.SERVER_DEFAULT_PNL,

      SYSTEM_PATHS.SERVER_USERCLIENTS,
      SYSTEM_PATHS.SERVER_USERCLIENTS_FT,
      SYSTEM_PATHS.SERVER_USERCLIENTS_LG,

      SYSTEM_PATHS.SERVER_TEMP_IMG,
      SYSTEM_PATHS.SERVER_QUARENTENA
    ];

    this.ensureDirs(dirs, resultado);
  },

  // ============================================================
  // * PASSO 3 *
  // Verifica pastas do terminal-client.
  // ============================================================
  passo03VerificarPastasTerminalClient(resultado: SeedResultado): void {
    const dirs = [
      SYSTEM_PATHS.IMAGENS_BASE,
      SYSTEM_PATHS.IMAGENS_ARQ_ZIP,

      SYSTEM_PATHS.IMAGENS_DEFAULTS,
      SYSTEM_PATHS.IMAGENS_DEFAULT_AVT,
      SYSTEM_PATHS.IMAGENS_DEFAULT_BTN,
      SYSTEM_PATHS.IMAGENS_DEFAULT_FT,
      SYSTEM_PATHS.IMAGENS_DEFAULT_LG,
      SYSTEM_PATHS.IMAGENS_DEFAULT_PNL,

      SYSTEM_PATHS.IMAGENS_USERCLIENTS,
      SYSTEM_PATHS.IMAGENS_USERCLIENTS_FT,
      SYSTEM_PATHS.IMAGENS_USERCLIENTS_LG,

      SYSTEM_PATHS.IMAGENS_REJEITADAS_IMG
    ];

    this.ensureDirs(dirs, resultado);
  },

  // ============================================================
  // * PASSO 4 *
  // Limpa temporários da sessão atual.
  // src/assets/img = staging.
  // src/assets/quarentena = rejeitados da sessão.
  // C:/imagens-sgv/quarentena = espelho de rejeitados da sessão.
  // C:/imagens-sgv/arq_zip = área auxiliar limpa.
  // ============================================================
  passo04LimparTemporarios(resultado: SeedResultado): void {
    this.clearFolder(SYSTEM_PATHS.SERVER_TEMP_IMG, resultado);
    this.clearFolder(SYSTEM_PATHS.SERVER_QUARENTENA, resultado);
    this.clearFolder(SYSTEM_PATHS.IMAGENS_REJEITADAS_IMG, resultado);
    this.clearFolder(SYSTEM_PATHS.IMAGENS_ARQ_ZIP, resultado);
  },

  // ============================================================
  // * PASSO 5 *
  // Baixa a tabela imagens para suas devidas pastas do servidor.
  // Isso garante que src/assets/* tenha a mesma base operacional do banco.
  // ============================================================
  async passo05BaixarBancoParaServidor(resultado: SeedResultado): Promise<number> {
    const rows: ImagemDbRow[] = await AppDataSource.query(`
      SELECT
        id,
        nome,
        tipo,
        path_origem,
        path_dest,
        public_url,
        svg
      FROM imagens
      ORDER BY id ASC
    `);

    let total = 0;

    for (const row of rows) {
      const destinoServidor = this.getServerPathByNome(row.nome);

      if (!destinoServidor) {
        const motivo = `registro ignorado por prefixo inválido: ${row.nome}`;

        resultado.erros.push({
          arquivo: row.nome,
          motivo
        });

        resultado.listas.erros.push(motivo);
        console.error(`[ERRO] ${motivo}`);
        continue;
      }

      try {
        this.writeSvgToDisk(destinoServidor, row.svg);
        resultado.listas.banco_para_servidor.push(row.nome);
        total++;
      } catch (error: any) {
        const motivo = `falha ao baixar banco para servidor: ${error?.message ?? 'erro desconhecido'}`;

        resultado.erros.push({
          arquivo: row.nome,
          destino: destinoServidor,
          motivo
        });

        resultado.listas.erros.push(`${row.nome} | ${motivo}`);
        console.error(`[ERRO] ${row.nome} | ${motivo}`);
      }
    }

    return total;
  },

  // ============================================================
  // * PASSO 6 *
  // Lista ZIPs encontrados no servidor.
  // ============================================================
  passo06ListarZips(resultado: SeedResultado): string[] {
    if (!fs.existsSync(SYSTEM_PATHS.SERVER_ZIP_SOURCE)) {
      return [];
    }

    const zipFiles = fs
      .readdirSync(SYSTEM_PATHS.SERVER_ZIP_SOURCE)
      .filter(file => file.toLowerCase().endsWith('.zip'));

    resultado.listas.zip_lidos.push(...zipFiles);

    return zipFiles;
  },

  // ============================================================
  // * PASSO 7 *
  // Descompacta ZIPs autorizados em src/assets/img.
  // ZIP não autorizado vai para quarentena.
  // ============================================================
  passo07DescompactarZips(zipFiles: string[], resultado: SeedResultado): void {
    for (const zipName of zipFiles) {
      const zipFullPath = path.join(SYSTEM_PATHS.SERVER_ZIP_SOURCE, zipName);

      if (!this.isZipAutorizado(zipName)) {
        const destino = this.resolveDestinationPath(
          SYSTEM_PATHS.SERVER_QUARENTENA,
          zipName,
          true
        );

        this.enviarParaQuarentena(
          zipFullPath,
          destino,
          zipName,
          'ZIP não autorizado',
          resultado
        );

        resultado.listas.zip_rejeitados.push(zipName);
        continue;
      }

      try {
        this.extractZip(zipFullPath, SYSTEM_PATHS.SERVER_TEMP_IMG);
        resultado.listas.zip_autorizados.push(zipName);
      } catch (error: any) {
        const motivo = `não foi possível descompactar: ${error?.message ?? 'erro desconhecido'}`;

        resultado.erros.push({
          arquivo: zipName,
          origem: zipFullPath,
          motivo
        });

        resultado.listas.erros.push(`${zipName} | ${motivo}`);
        console.error(`[ERRO] ${zipName} | ${motivo}`);
      }
    }
  },

  // ============================================================
  // * PASSO 8 *
  // Classifica cada arquivo extraído e move para a pasta correta do servidor.
  // Arquivo inválido vai para quarentena.
  // ============================================================
  passo08ClassificarEMoverArquivos(zipFiles: string[], resultado: SeedResultado): void {
    const arquivos = this.walkFiles(SYSTEM_PATHS.SERVER_TEMP_IMG);

    for (const filePath of arquivos) {
      const nome = path.basename(filePath);
      const zipOrigem = this.detectarZipOrigemPorNome(nome, zipFiles);
      const classificacao = this.classificarArquivo(nome, zipOrigem);

      if (!classificacao.valido) {
        const destino = this.resolveDestinationPath(
          SYSTEM_PATHS.SERVER_QUARENTENA,
          nome,
          true
        );

        this.enviarParaQuarentena(
          filePath,
          destino,
          nome,
          classificacao.motivo ?? 'arquivo rejeitado',
          resultado
        );

        continue;
      }

      const destinoServidor = path.join(classificacao.destinoServidor, nome);
      const destinoTerminal = path.join(classificacao.destinoTerminal, nome);

      try {
        this.copyFileToDisk(filePath, destinoServidor);

        const svg = fs.readFileSync(destinoServidor, 'utf8');

        resultado.validos.push({
          nome,
          tipo: classificacao.tipo,
          path_origem: destinoServidor,
          path_dest: destinoTerminal,
          public_url: this.buildPublicUrl(destinoTerminal),
          svg,
          createdBy: 0,
          updatedBy: 0
        });

        this.addLista(resultado, classificacao.lista, nome);
      } catch (error: any) {
        const destino = this.resolveDestinationPath(
          SYSTEM_PATHS.SERVER_QUARENTENA,
          nome,
          true
        );

        this.enviarParaQuarentena(
          filePath,
          destino,
          nome,
          `falha ao mover arquivo para destino: ${error?.message ?? 'erro desconhecido'}`,
          resultado
        );
      }
    }
  },

  // ============================================================
  // * PASSO 9 *
  // Persiste válidos no banco.
  // Se não existe, INSERT.
  // Se existe, UPDATE forçado.
  // ============================================================
  async passo09PersistirBanco(resultado: SeedResultado): Promise<void> {
    await this.persistirSeed(resultado.validos, resultado);
  },

  // ============================================================
  // * PASSO 10 *
  // Move qualquer sobra de src/assets/img para src/assets/quarentena.
  // Depois remove o staging.
  // ============================================================
  passo10MoverSobrasParaQuarentena(resultado: SeedResultado): void {
    const arquivos = this.walkFiles(SYSTEM_PATHS.SERVER_TEMP_IMG);

    for (const filePath of arquivos) {
      const nome = path.basename(filePath);

      // Se o arquivo já foi copiado como válido, ele pode continuar no staging por causa da extração.
      // Nesta etapa final, qualquer sobra física será preservada em quarentena para auditoria.
      const destino = this.resolveDestinationPath(
        SYSTEM_PATHS.SERVER_QUARENTENA,
        nome,
        true
      );

      if (resultado.validos.some(item => item.nome.toLowerCase() === nome.toLowerCase())) {
        continue;
      }

      this.enviarParaQuarentena(
        filePath,
        destino,
        nome,
        'arquivo restante em staging',
        resultado
      );
    }

    this.clearFolder(SYSTEM_PATHS.SERVER_TEMP_IMG, resultado);
  },

  // ============================================================
  // * PASSO 11 *
  // Espelha todas as pastas operacionais do servidor para C:/imagens-sgv.
  // Isso garante que servidor e terminal-client tenham os mesmos arquivos.
  // ============================================================
  passo11EspelharServidorParaTerminal(resultado: SeedResultado): number {
    let total = 0;

    for (const par of this.getParesOperacionais()) {
      const copiados = this.copyFolderFiles(par.servidor, par.terminal, resultado);
      total += copiados.length;

      for (const nome of copiados) {
        resultado.listas.servidor_para_terminal.push(`${par.lista}:${nome}`);
      }
    }

    const quarentenaCopiados = this.copyFolderFiles(
      SYSTEM_PATHS.SERVER_QUARENTENA,
      SYSTEM_PATHS.IMAGENS_REJEITADAS_IMG,
      resultado,
      true
    );

    total += quarentenaCopiados.length;

    for (const nome of quarentenaCopiados) {
      resultado.listas.servidor_para_terminal.push(`quarentena:${nome}`);
    }

    return total;
  },

  // ============================================================
  // * PASSO 12 *
  // Exibe listas finais do processo.
  // ============================================================
  passo12MostrarListas(resultado: SeedResultado): void {
    this.logLista('ZIP_LIDOS', resultado.listas.zip_lidos);
    this.logLista('ZIP_AUTORIZADOS', resultado.listas.zip_autorizados);
    this.logLista('ZIP_REJEITADOS', resultado.listas.zip_rejeitados);

    this.logLista('DEFAULTS_AVT', resultado.listas.defaults_avt);
    this.logLista('DEFAULTS_BTN', resultado.listas.defaults_btn);
    this.logLista('DEFAULTS_FT', resultado.listas.defaults_ft);
    this.logLista('DEFAULTS_LG', resultado.listas.defaults_lg);
    this.logLista('DEFAULTS_PNL', resultado.listas.defaults_pnl);
    this.logLista('FT_CLI', resultado.listas.ft_cli);
    this.logLista('LG_CLI', resultado.listas.lg_cli);

    this.logLista('QUARENTENA', resultado.listas.quarentena);
    this.logLista('BANCO_INSERT', resultado.listas.banco_insert);
    this.logLista('BANCO_UPDATE', resultado.listas.banco_update);
    this.logLista('BANCO_PARA_SERVIDOR', resultado.listas.banco_para_servidor);
    this.logLista('SERVIDOR_PARA_TERMINAL', resultado.listas.servidor_para_terminal);
    this.logLista('ERROS', resultado.listas.erros);
  },

  // ============================================================
  // * PERSIST DATABASE *
  // Insere quando não existe.
  // Atualiza sempre quando já existe.
  // ============================================================
  async persistirSeed(items: ImagemRegistro[], resultado?: SeedResultado): Promise<void> {
    for (const item of items) {
      const existingRows: ImagemDbRow[] = await AppDataSource.query(
        `
        SELECT id
        FROM imagens
        WHERE nome = ?
        LIMIT 1
        `,
        [item.nome]
      );

      const existente = existingRows[0];

      if (!existente) {
        await AppDataSource.query(
          `
          INSERT INTO imagens
            (
              nome,
              tipo,
              path_origem,
              path_dest,
              public_url,
              svg,
              createdBy,
              updatedBy
            )
          VALUES
            (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            item.nome,
            item.tipo,
            item.path_origem,
            item.path_dest,
            item.public_url,
            item.svg,
            item.createdBy,
            item.updatedBy
          ]
        );

        resultado?.listas.banco_insert.push(item.nome);
        continue;
      }

      await AppDataSource.query(
        `
        UPDATE imagens
           SET tipo = ?,
               path_origem = ?,
               path_dest = ?,
               public_url = ?,
               svg = ?,
               updatedBy = ?,
               updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?
        `,
        [
          item.tipo,
          item.path_origem,
          item.path_dest,
          item.public_url,
          item.svg,
          item.updatedBy,
          existente.id
        ]
      );

      resultado?.listas.banco_update.push(item.nome);
    }
  },

  // ============================================================
  // * SYNC FOLDER WITH DATABASE *
  // Sincroniza pasta operacional do servidor com banco.
  // ============================================================
  async syncFolderWithDatabase(folderPath: string, resultado?: SeedResultado): Promise<number> {
    const files = this.walkFiles(folderPath);
    const registros: ImagemRegistro[] = [];

    for (const filePath of files) {
      const nome = path.basename(filePath);
      const tipo = this.detectTipo(nome);

      if (tipo === 'img') {
        continue;
      }

      const terminalPath = this.getTerminalPathByNome(nome);

      if (!terminalPath) {
        continue;
      }

      try {
        registros.push({
          nome,
          tipo,
          path_origem: filePath,
          path_dest: terminalPath,
          public_url: this.buildPublicUrl(terminalPath),
          svg: fs.readFileSync(filePath, 'utf8'),
          createdBy: 0,
          updatedBy: 0
        });
      } catch (error: any) {
        const motivo = `falha ao ler arquivo de sync: ${error?.message ?? 'erro desconhecido'}`;
        resultado?.listas.erros.push(`${nome} | ${motivo}`);
      }
    }

    await this.persistirSeed(registros, resultado);

    return registros.length;
  },

  // ============================================================
  // * CLASSIFICAR ARQUIVO *
  // Valida arquivo conforme ZIP de origem e prefixo oficial.
  // ============================================================
  classificarArquivo(nome: string, zipOrigem?: string): ClassificacaoArquivo {
    const lower = nome.toLowerCase();
    const zip = zipOrigem?.toLowerCase();

    if (!lower.endsWith('.svg')) {
      return this.rejeitar(`Extensão inválida: ${nome}`);
    }

    if (zip === 'avt_sys.zip' && lower.startsWith('avt_def_')) {
      return this.aceitar('avatar', SYSTEM_PATHS.SERVER_DEFAULT_AVT, SYSTEM_PATHS.IMAGENS_DEFAULT_AVT, 'defaults_avt');
    }

    if (zip === 'btn_sys.zip' && lower.startsWith('btn_def_')) {
      return this.aceitar('botao', SYSTEM_PATHS.SERVER_DEFAULT_BTN, SYSTEM_PATHS.IMAGENS_DEFAULT_BTN, 'defaults_btn');
    }

    if (zip === 'ft_sys.zip' && lower.startsWith('ft_def_')) {
      return this.aceitar('foto', SYSTEM_PATHS.SERVER_DEFAULT_FT, SYSTEM_PATHS.IMAGENS_DEFAULT_FT, 'defaults_ft');
    }

    if (zip === 'ft_sys.zip' && lower.startsWith('ft_cli_')) {
      return this.aceitar('foto', SYSTEM_PATHS.SERVER_USERCLIENTS_FT, SYSTEM_PATHS.IMAGENS_USERCLIENTS_FT, 'ft_cli');
    }

    if (zip === 'lg_sys.zip' && lower.startsWith('lg_def_')) {
      return this.aceitar('logo', SYSTEM_PATHS.SERVER_DEFAULT_LG, SYSTEM_PATHS.IMAGENS_DEFAULT_LG, 'defaults_lg');
    }

    if (zip === 'lg_sys.zip' && lower.startsWith('lg_cli_')) {
      return this.aceitar('logo', SYSTEM_PATHS.SERVER_USERCLIENTS_LG, SYSTEM_PATHS.IMAGENS_USERCLIENTS_LG, 'lg_cli');
    }

    if (zip === 'pnl_sys.zip' && lower.startsWith('pnl_def_')) {
      return this.aceitar('painel', SYSTEM_PATHS.SERVER_DEFAULT_PNL, SYSTEM_PATHS.IMAGENS_DEFAULT_PNL, 'defaults_pnl');
    }

    return this.rejeitar(
      `Arquivo não compatível com destino: arquivo=${nome} zip=${zipOrigem ?? 'não identificado'}`
    );
  },

  aceitar(
    tipo: ImagemTipo,
    destinoServidor: string,
    destinoTerminal: string,
    lista: keyof SeedListas
  ): ClassificacaoArquivo {
    return {
      valido: true,
      tipo,
      destinoServidor,
      destinoTerminal,
      lista
    };
  },

  rejeitar(motivo: string): ClassificacaoArquivo {
    return {
      valido: false,
      tipo: 'img',
      destinoServidor: SYSTEM_PATHS.SERVER_QUARENTENA,
      destinoTerminal: SYSTEM_PATHS.IMAGENS_REJEITADAS_IMG,
      lista: 'quarentena',
      motivo
    };
  },

  // ============================================================
  // * DETECTAR ZIP ORIGEM POR NOME *
  // Detecta o ZIP esperado pelo prefixo oficial.
  // ============================================================
  detectarZipOrigemPorNome(nome: string, zipFiles: string[]): string | undefined {
    const lower = nome.toLowerCase();

    const esperado =
      lower.startsWith('avt_def_') ? 'avt_sys.zip' :
      lower.startsWith('btn_def_') ? 'btn_sys.zip' :
      lower.startsWith('ft_def_') || lower.startsWith('ft_cli_') ? 'ft_sys.zip' :
      lower.startsWith('lg_def_') || lower.startsWith('lg_cli_') ? 'lg_sys.zip' :
      lower.startsWith('pnl_def_') ? 'pnl_sys.zip' :
      undefined;

    if (!esperado) {
      return undefined;
    }

    return zipFiles.find(zip => zip.toLowerCase() === esperado);
  },

  // ============================================================
  // * DETECT TIPO *
  // Só reconhece prefixos oficiais.
  // ============================================================
  detectTipo(nome: string): ImagemTipo {
    const lower = nome.toLowerCase();

    if (lower.startsWith('avt_def_')) return 'avatar';
    if (lower.startsWith('btn_def_')) return 'botao';
    if (lower.startsWith('ft_def_')) return 'foto';
    if (lower.startsWith('ft_cli_')) return 'foto';
    if (lower.startsWith('lg_def_')) return 'logo';
    if (lower.startsWith('lg_cli_')) return 'logo';
    if (lower.startsWith('pnl_def_')) return 'painel';

    return 'img';
  },

  // ============================================================
  // * PATH HELPERS *
  // ============================================================
  getServerPathByNome(nome: string): string | null {
    const lower = nome.toLowerCase();

    if (lower.startsWith('avt_def_')) return path.join(SYSTEM_PATHS.SERVER_DEFAULT_AVT, nome);
    if (lower.startsWith('btn_def_')) return path.join(SYSTEM_PATHS.SERVER_DEFAULT_BTN, nome);
    if (lower.startsWith('ft_def_')) return path.join(SYSTEM_PATHS.SERVER_DEFAULT_FT, nome);
    if (lower.startsWith('ft_cli_')) return path.join(SYSTEM_PATHS.SERVER_USERCLIENTS_FT, nome);
    if (lower.startsWith('lg_def_')) return path.join(SYSTEM_PATHS.SERVER_DEFAULT_LG, nome);
    if (lower.startsWith('lg_cli_')) return path.join(SYSTEM_PATHS.SERVER_USERCLIENTS_LG, nome);
    if (lower.startsWith('pnl_def_')) return path.join(SYSTEM_PATHS.SERVER_DEFAULT_PNL, nome);

    return null;
  },

  getTerminalPathByNome(nome: string): string | null {
    const lower = nome.toLowerCase();

    if (lower.startsWith('avt_def_')) return path.join(SYSTEM_PATHS.IMAGENS_DEFAULT_AVT, nome);
    if (lower.startsWith('btn_def_')) return path.join(SYSTEM_PATHS.IMAGENS_DEFAULT_BTN, nome);
    if (lower.startsWith('ft_def_')) return path.join(SYSTEM_PATHS.IMAGENS_DEFAULT_FT, nome);
    if (lower.startsWith('ft_cli_')) return path.join(SYSTEM_PATHS.IMAGENS_USERCLIENTS_FT, nome);
    if (lower.startsWith('lg_def_')) return path.join(SYSTEM_PATHS.IMAGENS_DEFAULT_LG, nome);
    if (lower.startsWith('lg_cli_')) return path.join(SYSTEM_PATHS.IMAGENS_USERCLIENTS_LG, nome);
    if (lower.startsWith('pnl_def_')) return path.join(SYSTEM_PATHS.IMAGENS_DEFAULT_PNL, nome);

    return null;
  },

  getParesOperacionais(): PastaPar[] {
    return [
      {
        lista: 'defaults_avt',
        servidor: SYSTEM_PATHS.SERVER_DEFAULT_AVT,
        terminal: SYSTEM_PATHS.IMAGENS_DEFAULT_AVT
      },
      {
        lista: 'defaults_btn',
        servidor: SYSTEM_PATHS.SERVER_DEFAULT_BTN,
        terminal: SYSTEM_PATHS.IMAGENS_DEFAULT_BTN
      },
      {
        lista: 'defaults_ft',
        servidor: SYSTEM_PATHS.SERVER_DEFAULT_FT,
        terminal: SYSTEM_PATHS.IMAGENS_DEFAULT_FT
      },
      {
        lista: 'defaults_lg',
        servidor: SYSTEM_PATHS.SERVER_DEFAULT_LG,
        terminal: SYSTEM_PATHS.IMAGENS_DEFAULT_LG
      },
      {
        lista: 'defaults_pnl',
        servidor: SYSTEM_PATHS.SERVER_DEFAULT_PNL,
        terminal: SYSTEM_PATHS.IMAGENS_DEFAULT_PNL
      },
      {
        lista: 'ft_cli',
        servidor: SYSTEM_PATHS.SERVER_USERCLIENTS_FT,
        terminal: SYSTEM_PATHS.IMAGENS_USERCLIENTS_FT
      },
      {
        lista: 'lg_cli',
        servidor: SYSTEM_PATHS.SERVER_USERCLIENTS_LG,
        terminal: SYSTEM_PATHS.IMAGENS_USERCLIENTS_LG
      }
    ];
  },

  // ============================================================
  // * RESULT STRUCTURE *
  // ============================================================
  criarEstruturaResultado(): SeedResultado {
    return {
      validos: [],
      rejeitados: [],
      erros: [],
      listas: {
        zip_lidos: [],
        zip_autorizados: [],
        zip_rejeitados: [],

        defaults_avt: [],
        defaults_btn: [],
        defaults_ft: [],
        defaults_lg: [],
        defaults_pnl: [],
        ft_cli: [],
        lg_cli: [],

        quarentena: [],
        banco_insert: [],
        banco_update: [],

        servidor_para_terminal: [],
        banco_para_servidor: [],

        pastas_criadas: [],
        pastas_existentes: [],
        erros: []
      }
    };
  },

  // ============================================================
  // * FILE SYSTEM HELPERS *
  // ============================================================
  ensureDirs(dirs: string[], resultado: SeedResultado): void {
    for (const dir of dirs) {
      try {
        if (fs.existsSync(dir)) {
          resultado.listas.pastas_existentes.push(dir);
          continue;
        }

        fs.mkdirSync(dir, { recursive: true });
        resultado.listas.pastas_criadas.push(dir);
      } catch (error: any) {
        const motivo = `falha ao criar pasta: ${error?.message ?? 'erro desconhecido'}`;

        resultado.erros.push({
          arquivo: dir,
          motivo
        });

        resultado.listas.erros.push(`${dir} | ${motivo}`);
        console.error(`[ERRO][IMAGENS] ${dir} | ${motivo}`);
      }
    }
  },

  clearFolder(folderPath: string, resultado?: SeedResultado): void {
    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        resultado?.listas.pastas_criadas.push(folderPath);
        return;
      }

      for (const entry of fs.readdirSync(folderPath)) {
        fs.rmSync(path.join(folderPath, entry), {
          recursive: true,
          force: true
        });
      }
    } catch (error: any) {
      const motivo = `falha ao limpar pasta: ${error?.message ?? 'erro desconhecido'}`;

      resultado?.erros.push({
        arquivo: folderPath,
        motivo
      });

      resultado?.listas.erros.push(`${folderPath} | ${motivo}`);
      console.error(`[ERRO] ${folderPath} | ${motivo}`);
    }
  },

  writeSvgToDisk(fullPath: string, svg: string): void {
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, svg, 'utf8');
  },

  copyFileToDisk(sourcePath: string, destPath: string): void {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(sourcePath, destPath);
  },

  copyFolderFiles(
    sourceDir: string,
    destDir: string,
    resultado: SeedResultado,
    avoidOverwrite = false
  ): string[] {
    const files = this.walkFiles(sourceDir);
    const copied: string[] = [];

    for (const filePath of files) {
      const nome = path.basename(filePath);
      const destino = this.resolveDestinationPath(destDir, nome, avoidOverwrite);

      try {
        this.copyFileToDisk(filePath, destino);
        copied.push(path.basename(destino));
      } catch (error: any) {
        const motivo = `falha ao copiar arquivo: ${error?.message ?? 'erro desconhecido'}`;

        resultado.erros.push({
          arquivo: nome,
          origem: filePath,
          destino,
          motivo
        });

        resultado.listas.erros.push(`${nome} | ${motivo}`);
        console.error(`[ERRO] ${nome} | ${motivo}`);
      }
    }

    return copied;
  },

  enviarParaQuarentena(
    sourcePath: string,
    destPath: string,
    arquivo: string,
    motivo: string,
    resultado: SeedResultado
  ): void {
    try {
      this.copyFileToDisk(sourcePath, destPath);

      resultado.rejeitados.push({
        arquivo,
        origem: sourcePath,
        destino: destPath,
        motivo
      });

      resultado.listas.quarentena.push(path.basename(destPath));
      console.warn(`[QUARENTENA][IMAGENS] ${arquivo} | ${motivo}`);
    } catch (error: any) {
      const motivoErro = `falha ao enviar para quarentena: ${error?.message ?? 'erro desconhecido'}`;

      resultado.erros.push({
        arquivo,
        origem: sourcePath,
        destino: destPath,
        motivo: motivoErro
      });

      resultado.listas.erros.push(`${arquivo} | ${motivoErro}`);
      console.error(`[ERRO] ${arquivo} | ${motivoErro}`);
    }
  },

  resolveDestinationPath(destino: string, nome: string, avoidOverwrite = false): string {
    const fullPath = path.join(destino, nome);

    if (!avoidOverwrite || !fs.existsSync(fullPath)) {
      return fullPath;
    }

    const parsed = path.parse(nome);
    const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '');

    return path.join(destino, `${parsed.name}_${stamp}${parsed.ext}`);
  },

  extractZip(zipFullPath: string, extractDir: string): void {
    execFileSync(
      'powershell',
      [
        '-NoProfile',
        '-Command',
        `Expand-Archive -LiteralPath '${zipFullPath.replace(/'/g, "''")}' -DestinationPath '${extractDir.replace(/'/g, "''")}' -Force`
      ],
      { stdio: 'ignore' }
    );
  },

  walkFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) {
      return [];
    }

    const files: string[] = [];

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...this.walkFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }

    return files;
  },

  isZipAutorizado(zipName: string): boolean {
    return [
      'avt_sys.zip',
      'btn_sys.zip',
      'ft_sys.zip',
      'lg_sys.zip',
      'pnl_sys.zip'
    ].includes(zipName.toLowerCase());
  },

  buildPublicUrl(fullPath: string): string {
    const base = path.resolve(SYSTEM_PATHS.IMAGENS_BASE);
    const target = path.resolve(fullPath);

    return `/assets/${path.relative(base, target).replace(/\\/g, '/')}`;
  },

  addLista(resultado: SeedResultado, lista: keyof SeedListas, arquivo: string): void {
    const target = resultado.listas[lista];

    if (Array.isArray(target)) {
      target.push(arquivo);
    }
  },

  formatLista(lista: string[]): string {
    return lista.length > 0 ? lista.join(', ') : '-';
  },

  logStep(passo: number, mensagem: string): void {
    console.info(`[PASSO ${passo}][IMAGENS] ${mensagem}`);
  },

  logOk(passo: number, mensagem: string): void {
    console.info(`[OK][PASSO ${passo}][IMAGENS] ${mensagem}`);
  },

  logLista(nome: string, lista: string[]): void {
    console.info(`[LISTA][${nome}] ${this.formatLista(lista)}`);
  }
};
