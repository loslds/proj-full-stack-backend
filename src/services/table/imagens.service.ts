
 
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
  banco_ignorado: string[];

  banco_para_servidor: string[];
  servidor_para_terminal: string[];

  fisicos_servidor: string[];
  fisicos_terminal: string[];

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

type RegraArquivo = {
  zip: string;
  prefixos: string[];
  tipo: ImagemTipo;
  servidor: string;
  terminal: string;
  lista: keyof SeedListas;
};

// ============================================================
// * CONSTANTS *
// ============================================================

const SLEEP_TIME_MS = 800;

const ZIP_AUTORIZADOS = [
  'avt_sys.zip',
  'btn_sys.zip',
  'ft_sys.zip',
  'lg_sys.zip',
  'pnl_sys.zip',
  'ft_cli_sys.zip',
  'lg_cli_sys.zip'
];

const REGRAS_ARQUIVOS: RegraArquivo[] = [
  {
    zip: 'avt_sys.zip',
    prefixos: ['avt_def_'],
    tipo: 'avatar',
    servidor: SYSTEM_PATHS.SERVER_DEFAULT_AVT,
    terminal: SYSTEM_PATHS.IMAGENS_DEFAULT_AVT,
    lista: 'defaults_avt'
  },
  {
    zip: 'btn_sys.zip',
    prefixos: ['btn_def_'],
    tipo: 'botao',
    servidor: SYSTEM_PATHS.SERVER_DEFAULT_BTN,
    terminal: SYSTEM_PATHS.IMAGENS_DEFAULT_BTN,
    lista: 'defaults_btn'
  },
  {
    zip: 'ft_sys.zip',
    prefixos: ['ft_def_'],
    tipo: 'foto',
    servidor: SYSTEM_PATHS.SERVER_DEFAULT_FT,
    terminal: SYSTEM_PATHS.IMAGENS_DEFAULT_FT,
    lista: 'defaults_ft'
  },
  {
    zip: 'lg_sys.zip',
    prefixos: ['lg_def_'],
    tipo: 'logo',
    servidor: SYSTEM_PATHS.SERVER_DEFAULT_LG,
    terminal: SYSTEM_PATHS.IMAGENS_DEFAULT_LG,
    lista: 'defaults_lg'
  },
  {
    zip: 'pnl_sys.zip',
    prefixos: ['pnl_def_'],
    tipo: 'painel',
    servidor: SYSTEM_PATHS.SERVER_DEFAULT_PNL,
    terminal: SYSTEM_PATHS.IMAGENS_DEFAULT_PNL,
    lista: 'defaults_pnl'
  },
  {
    zip: 'ft_cli_sys.zip',
    prefixos: ['ft_cli_'],
    tipo: 'foto',
    servidor: SYSTEM_PATHS.SERVER_USERCLIENTS_FT,
    terminal: SYSTEM_PATHS.IMAGENS_USERCLIENTS_FT,
    lista: 'ft_cli'
  },
  {
    zip: 'lg_cli_sys.zip',
    prefixos: ['lg_cli_'],
    tipo: 'logo',
    servidor: SYSTEM_PATHS.SERVER_USERCLIENTS_LG,
    terminal: SYSTEM_PATHS.IMAGENS_USERCLIENTS_LG,
    lista: 'lg_cli'
  }
];

// ============================================================
// * SERVICE *
// ============================================================

export const imagensService = {
  tableName: 'imagens',

  
  // ============================================================
  // * tempo de espera para o próximo processo *
  // ============================================================
  async sleepTime(ms = SLEEP_TIME_MS ): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  },


  // ============================================================
  // * PASSO 1 - CONNECTION *
  // ============================================================
  async ensureConnection(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  },

  // ============================================================
  // * PASSO 1 - CREATE TABLE *
  // ============================================================
  async create(): Promise<void> {
    await this.ensureConnection();

    if (!createLogged) {
      console.log(`>>> [${this.tableName}Service] Iniciado`);
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
  // Arquitetura final:
  // 1 conexão/tabela
  // 2 pastas backend
  // 3 pastas C:/imagens-sgb
  // 4 limpar apenas src/assets/img
  // 5 localizar ZIPs
  // 6 validar ZIPs; inválido -> quarentena servidor
  // 7 descompactar ZIPs válidos
  // 8 classificar arquivos; inválido -> quarentena servidor; válido -> memória
  // 9 insert/update banco
  // 10 reconstruir src/assets a partir da tabela imagens
  // 11 sincronizar src/assets para C:/imagens-sgb
  // 12 exibir listas físicas reais
  // ============================================================
  async seed(): Promise<SeedResultado> {
    const resultado = this.criarEstruturaResultado();
    let totalServidor = 0;
    let totalTerminal = 0;

    try {
      this.logStep(1, 'Verificando conexão e tabela imagens');
      await this.ensureConnection();
      await this.create();
      this.logOk(1, 'Tabela imagens pronta');
      await this.sleepTime();

      this.logStep(2, 'Criando/verificando pastas backend');
      this.passo02VerificarPastasServidor(resultado);
      this.logOk(2, 'Pastas backend verificadas');
      await this.sleepTime();

      this.logStep(3, 'Criando/verificando pastas C:/imagens-sgb');
      this.passo03VerificarPastasTerminalClient(resultado);
      this.logOk(3, 'Pastas C:/imagens-sgb verificadas');
      await this.sleepTime();

      this.logStep(4, 'Limpando apenas src/assets/img');
      this.passo04LimparTemporarios(resultado);
      this.logOk(4, 'src/assets/img limpa');
      await this.sleepTime();

      this.logStep(5, 'Localizando ZIPs em src/assets/arq_zip');
      const zipFiles = this.passo05LocalizarZips(resultado);
      this.logOk(5, `ZIPs localizados: ${zipFiles.length}`);
      await this.sleepTime();

      this.logStep(6, 'Validando ZIPs');
      const zipsValidos = this.passo06ValidarZips(zipFiles, resultado);
      this.logOk(6, `ZIPs válidos: ${zipsValidos.length} | rejeitados: ${resultado.listas.zip_rejeitados.length}`);
      await this.sleepTime();

      this.logStep(7, 'Descompactando ZIPs válidos');
      this.passo07DescompactarZips(zipsValidos, resultado);
      this.logOk(7, `ZIPs descompactados: ${resultado.listas.zip_autorizados.length}`);
      await this.sleepTime();

      this.logStep(8, 'Classificando arquivos extraídos');
      this.passo08ClassificarArquivos(resultado);
      this.logOk(8, `Arquivos válidos em memória: ${resultado.validos.length} | quarentena: ${resultado.listas.quarentena.length}`);
      await this.sleepTime();

      this.logStep(9, 'Persistindo registros válidos na tabela imagens');
      await this.passo09PersistirBanco(resultado);
      this.logOk(9, `Banco insert=${resultado.listas.banco_insert.length} update=${resultado.listas.banco_update.length}`);
      await this.sleepTime();

      this.logStep(10, 'Reconstruindo src/assets a partir da tabela imagens');
      totalServidor = await this.passo10ReconstruirServidorAPartirDoBanco(resultado);
      this.logOk(10, `Arquivos reconstruídos no servidor: ${totalServidor}`);
      await this.sleepTime();

      this.logStep(11, 'Sincronizando src/assets para C:/imagens-sgb');
      totalTerminal = this.passo11SincronizarServidorParaTerminal(resultado);
      this.logOk(11, `Arquivos sincronizados para terminal-client: ${totalTerminal}`);
      await this.sleepTime();

      this.logStep(12, 'Exibindo listas físicas reais');
      this.passo12ListarFisicosEExibir(resultado);

      console.info(
        `[RESUMO][IMAGENS] validos=${resultado.validos.length} | rejeitados=${resultado.rejeitados.length} | erros=${resultado.erros.length} | servidor=${totalServidor} | terminal=${totalTerminal}`
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
      this.passo12ListarFisicosEExibir(resultado);

      return resultado;
    }
  },

  // ============================================================
  // * UPDATE *
  // Sincroniza arquivos operacionais do servidor com banco e terminal.
  // ============================================================
  async update(): Promise<UpdateResultado> {
    await this.ensureConnection();
    await this.create();

    const resultado = this.criarEstruturaResultado();

    let sincronizadosNoBanco = 0;
    let exportadosNoDisco = 0;

    try {
      console.info('[PASSO UPDATE 1][IMAGENS] Verificando pastas');
      this.passo02VerificarPastasServidor(resultado);
      this.passo03VerificarPastasTerminalClient(resultado);
      await this.sleepTime();

      console.info('[PASSO UPDATE 2][IMAGENS] Sincronizando servidor com banco');
      for (const par of this.getParesOperacionais()) {
        sincronizadosNoBanco += await this.syncFolderWithDatabase(par.servidor, resultado);
      }
      await this.sleepTime();

      console.info('[PASSO UPDATE 3][IMAGENS] Sincronizando servidor para terminal-client');
      exportadosNoDisco = this.passo11SincronizarServidorParaTerminal(resultado);
      await this.sleepTime();

      this.passo12ListarFisicosEExibir(resultado);

      console.info(
        `[RESUMO][IMAGENS] update | banco=${sincronizadosNoBanco} | terminal=${exportadosNoDisco} | erros=${resultado.erros.length}`
      );

      return {
        sincronizadosNoBanco,
        exportadosNoDisco,
        erros: resultado.erros
      };
    } catch (error: any) {
      const motivo = error?.message ?? 'erro desconhecido';

      resultado.erros.push({
        arquivo: 'update',
        motivo
      });

      resultado.listas.erros.push(`update | ${motivo}`);
      console.error(`[ERRO][IMAGENS] update | ${motivo}`);

      return {
        sincronizadosNoBanco,
        exportadosNoDisco,
        erros: resultado.erros
      };
    }
  },

  // ============================================================
  // * PASSO 2 *
  // Verifica/cria pastas do backend.
  // A quarentena existe somente no servidor para auditoria.
  // ============================================================
  passo02VerificarPastasServidor(resultado: SeedResultado): void {
    this.ensureDirs(
      [
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
      ],
      resultado
    );
  },

  // ============================================================
  // * PASSO 3 *
  // Verifica/cria pastas do terminal-client.
  // Não existe pasta de rejeitadas no terminal-client.
  // ============================================================
  passo03VerificarPastasTerminalClient(resultado: SeedResultado): void {
    this.ensureDirs(
      [
        SYSTEM_PATHS.IMAGENS_BASE,

        SYSTEM_PATHS.IMAGENS_DEFAULTS,
        SYSTEM_PATHS.IMAGENS_DEFAULT_AVT,
        SYSTEM_PATHS.IMAGENS_DEFAULT_BTN,
        SYSTEM_PATHS.IMAGENS_DEFAULT_FT,
        SYSTEM_PATHS.IMAGENS_DEFAULT_LG,
        SYSTEM_PATHS.IMAGENS_DEFAULT_PNL,

        SYSTEM_PATHS.IMAGENS_USERCLIENTS,
        SYSTEM_PATHS.IMAGENS_USERCLIENTS_FT,
        SYSTEM_PATHS.IMAGENS_USERCLIENTS_LG
      ],
      resultado
    );
  },

  // ============================================================
  // * PASSO 4 *
  // Limpa apenas src/assets/img.
  // Nunca limpa src/assets/quarentena, pois é auditoria.
  // Nunca limpa pasta de rejeitados no terminal, pois ela não existe.
  // ============================================================
  passo04LimparTemporarios(resultado: SeedResultado): void {
    this.clearFolder(SYSTEM_PATHS.SERVER_TEMP_IMG, resultado);
  },

  // ============================================================
  // * PASSO 5 *
  // Localiza ZIPs no backend.
  // ============================================================
  passo05LocalizarZips(resultado: SeedResultado): string[] {
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
  // * PASSO 6 *
  // Valida ZIPs.
  // ZIP inválido é copiado para src/assets/quarentena.
  // ============================================================
  passo06ValidarZips(zipFiles: string[], resultado: SeedResultado): string[] {
    const zipsValidos: string[] = [];

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

      zipsValidos.push(zipName);
    }

    return zipsValidos;
  },

  // ============================================================
  // * PASSO 7 *
  // Descompacta cada ZIP autorizado em subpasta temporária própria.
  // ============================================================
  passo07DescompactarZips(zipFiles: string[], resultado: SeedResultado): void {
    for (const zipName of zipFiles) {
      const zipFullPath = path.join(SYSTEM_PATHS.SERVER_ZIP_SOURCE, zipName);
      const zipLower = zipName.toLowerCase();
      const extractDir = this.getZipExtractDir(zipLower);

      try {
        this.clearFolder(extractDir, resultado);
        this.extractZip(zipFullPath, extractDir);
        resultado.listas.zip_autorizados.push(zipName);
        console.info(`[ZIP][IMAGENS] Processando ${zipName}`);
      } catch (error: any) {
        const motivo = `não foi possível descompactar: ${error?.message ?? 'erro desconhecido'}`;

        resultado.erros.push({
          arquivo: zipName,
          origem: zipFullPath,
          motivo
        });

        resultado.listas.erros.push(`${zipName} | ${motivo}`);
        console.error(`[ERRO][IMAGENS] ${zipName} | ${motivo}`);
      }
    }
  },

  // ============================================================
  // * PASSO 8 *
  // Classifica arquivos.
  // Válido: fica em memória em resultado.validos.
  // Inválido: cópia para src/assets/quarentena.
  // Não move arquivo válido nesta etapa.
  // ============================================================
  passo08ClassificarArquivos(resultado: SeedResultado): void {
    for (const zipName of resultado.listas.zip_autorizados) {
      const zipLower = zipName.toLowerCase();
      const extractDir = this.getZipExtractDir(zipLower);
      const arquivos = this.walkFiles(extractDir);

      for (const filePath of arquivos) {
        const nome = path.basename(filePath);
        const classificacao = this.classificarArquivo(nome, zipLower);

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

        try {
          const destinoServidor = path.join(classificacao.destinoServidor, nome);
          const destinoTerminal = path.join(classificacao.destinoTerminal, nome);
          const svg = fs.readFileSync(filePath, 'utf8');

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
            `falha ao ler arquivo classificado: ${error?.message ?? 'erro desconhecido'}`,
            resultado
          );
        }
      }
    }
  },

  // ============================================================
  // * PASSO 9 *
  // ============================================================
  async passo09PersistirBanco(resultado: SeedResultado): Promise<void> {
    await this.persistirSeed(resultado.validos, resultado);
  },

  // ============================================================
  // * PASSO 10 *
  // Reconstrói pastas operacionais do servidor a partir do banco.
  // Não apaga arq_zip nem quarentena.
  // ============================================================
  async passo10ReconstruirServidorAPartirDoBanco(resultado: SeedResultado): Promise<number> {
    this.clearPastasOperacionaisServidor(resultado);
    return this.baixarBancoParaServidor(resultado);
  },

  // ============================================================
  // * PASSO 11 *
  // Sincroniza pastas operacionais do servidor para C:/imagens-sgb.
  // Não copia quarentena para C:/imagens-sgb.
  // ============================================================
  passo11SincronizarServidorParaTerminal(resultado: SeedResultado): number {
    this.clearPastasOperacionaisTerminal(resultado);

    let total = 0;

    for (const par of this.getParesOperacionais()) {
      const copiados = this.copyFolderFiles(par.servidor, par.terminal, resultado);
      total += copiados.length;

      for (const nome of copiados) {
        resultado.listas.servidor_para_terminal.push(`${String(par.lista)}:${nome}`);
      }
    }

    return total;
  },

  // ============================================================
  // * PASSO 12 *
  // Exibe listas finais, incluindo listas físicas reais.
  // ============================================================
  passo12ListarFisicosEExibir(resultado: SeedResultado): void {
    resultado.listas.fisicos_servidor = this.listarArquivosOperacionaisServidor();
    resultado.listas.fisicos_terminal = this.listarArquivosOperacionaisTerminal();

    this.passo12MostrarListas(resultado);
  },

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
    this.logLista('BANCO_IGNORADO', resultado.listas.banco_ignorado);
    this.logLista('BANCO_PARA_SERVIDOR', resultado.listas.banco_para_servidor);
    this.logLista('SERVIDOR_PARA_TERMINAL', resultado.listas.servidor_para_terminal);
    this.logLista('FISICOS_SERVIDOR', resultado.listas.fisicos_servidor);
    this.logLista('FISICOS_TERMINAL', resultado.listas.fisicos_terminal);
    this.logLista('PASTAS_CRIADAS', resultado.listas.pastas_criadas);
    this.logLista('PASTAS_EXISTENTES', resultado.listas.pastas_existentes);
    this.logLista('ERROS', resultado.listas.erros);
  },

  // ============================================================
  // * DATABASE *
  // ============================================================
  async persistirSeed(items: ImagemRegistro[], resultado?: SeedResultado): Promise<void> {
    for (const item of items) {
      const existingRows: Pick<ImagemDbRow, 'id'>[] = await AppDataSource.query(
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

  async baixarBancoParaServidor(resultado: SeedResultado): Promise<number> {
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
        resultado.listas.banco_ignorado.push(row.nome);
        console.warn(`[IGNORADO][IMAGENS] ${motivo}`);
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
        console.error(`[ERRO][IMAGENS] ${row.nome} | ${motivo}`);
      }
    }

    return total;
  },

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
  // * CLASSIFICAÇÃO *
  // ============================================================
  classificarArquivo(nome: string, zipOrigem?: string): ClassificacaoArquivo {
    const lower = nome.toLowerCase();
    const zip = zipOrigem?.toLowerCase();

    if (!lower.endsWith('.svg')) {
      return this.rejeitar(`Extensão inválida: ${nome}`);
    }

    if (!zip || !this.isZipAutorizado(zip)) {
      return this.rejeitar(
        `Arquivo não compatível com destino: arquivo=${nome} zip=${zipOrigem ?? 'não identificado'}`
      );
    }

    const regra = this.getRegraPorArquivo(lower);

    if (!regra) {
      return this.rejeitar(
        `Arquivo não compatível com destino: arquivo=${nome} zip=${zipOrigem ?? 'não identificado'}`
      );
    }

    if (regra.zip !== zip) {
      return this.rejeitar(
        `Arquivo não compatível com destino: arquivo=${nome} zip=${zipOrigem ?? 'não identificado'} esperado=${regra.zip}`
      );
    }

    return this.aceitar(regra.tipo, regra.servidor, regra.terminal, regra.lista);
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
      destinoTerminal: '',
      lista: 'quarentena',
      motivo
    };
  },

  // ============================================================
  // * DETECÇÕES *
  // ============================================================
  detectarZipOrigemPorNome(nome: string, zipFiles: string[]): string | undefined {
    const regra = this.getRegraPorArquivo(nome.toLowerCase());

    if (!regra) {
      return undefined;
    }

    return zipFiles.find(zip => zip.toLowerCase() === regra.zip);
  },

  detectTipo(nome: string): ImagemTipo {
    const regra = this.getRegraPorArquivo(nome.toLowerCase());
    return regra?.tipo ?? 'img';
  },

  getRegraPorArquivo(nomeLower: string): RegraArquivo | undefined {
    return REGRAS_ARQUIVOS.find(regra =>
      regra.prefixos.some(prefixo => nomeLower.startsWith(prefixo))
    );
  },

  isZipAutorizado(zipName: string): boolean {
    return ZIP_AUTORIZADOS.includes(zipName.toLowerCase());
  },

  // ============================================================
  // * PATH HELPERS *
  // ============================================================
  getServerPathByNome(nome: string): string | null {
    const regra = this.getRegraPorArquivo(nome.toLowerCase());
    return regra ? path.join(regra.servidor, nome) : null;
  },

  getTerminalPathByNome(nome: string): string | null {
    const regra = this.getRegraPorArquivo(nome.toLowerCase());
    return regra ? path.join(regra.terminal, nome) : null;
  },

  getZipExtractDir(zipName: string): string {
    const parsed = path.parse(zipName.toLowerCase());
    return path.join(SYSTEM_PATHS.SERVER_TEMP_IMG, parsed.name);
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

  listarArquivosOperacionaisServidor(): string[] {
    return this.getParesOperacionais().flatMap(par =>
      this.walkFiles(par.servidor).map(filePath => `${String(par.lista)}:${path.basename(filePath)}`)
    );
  },

  listarArquivosOperacionaisTerminal(): string[] {
    return this.getParesOperacionais().flatMap(par =>
      this.walkFiles(par.terminal).map(filePath => `${String(par.lista)}:${path.basename(filePath)}`)
    );
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
        banco_ignorado: [],

        banco_para_servidor: [],
        servidor_para_terminal: [],

        fisicos_servidor: [],
        fisicos_terminal: [],

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
      console.error(`[ERRO][IMAGENS] ${folderPath} | ${motivo}`);
    }
  },

  clearPastasOperacionaisServidor(resultado: SeedResultado): void {
    for (const par of this.getParesOperacionais()) {
      this.clearFolder(par.servidor, resultado);
    }
  },

  clearPastasOperacionaisTerminal(resultado: SeedResultado): void {
    for (const par of this.getParesOperacionais()) {
      this.clearFolder(par.terminal, resultado);
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
        console.error(`[ERRO][IMAGENS] ${nome} | ${motivo}`);
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
      console.error(`[ERRO][IMAGENS] ${arquivo} | ${motivoErro}`);
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
    fs.mkdirSync(extractDir, { recursive: true });

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

  //  async sleepTime(ms = SLEEP_TIME_MS): Promise<void> {
  //   await new Promise(resolve => setTimeout(resolve, ms));
  // },

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
  
