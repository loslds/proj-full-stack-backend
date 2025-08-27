 
  // src/user-case/start/dbRoutes.ts
import { Router } from 'express';
import { dbSource } from './dbSource';
import { checkDatabases } from './dbController';
import { syncSysTables } from '../../services/syncsysTables';

const router = Router();

/** Checa a existencia de Tabela data_sys */ 
router.get('/check-chk.db', async (req, res) => {
  try {
    const dataSource = req.app.get('dataSource');

    // Verifica se a tabela existe e retorna um count
    const result = await dataSource.query('SELECT COUNT(*) AS total FROM systables');

    res.status(200).json({
      success: true,
      message: 'Tabela systables verificada com sucesso!',
      totalRegistros: result[0].total
    });

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao verificar tabela systables',
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro desconhecido ao verificar tabela systables'
      });
    }
  }
});

// Rota nova: faz toda a checagem e cria tabelas necessárias quando não existirem
router.get('/check-databases', checkDatabases);

// Rota já existente para campo chkdb — tabela systable
router.get('/check-chkdb', async (req, res) => {
  try {
    if (!dbSource.isInitialized) {
      await dbSource.initialize();
    }
    const queryRunner = dbSource.createQueryRunner();
    await queryRunner.connect();

    // consultar a linha systables (criada pelo check-databases)
    const [rows] = await queryRunner.query(`SELECT chkdb FROM systables WHERE nome = 'systable_nome' LIMIT 1`);
    await queryRunner.release();

    if ((rows as any[]).length > 0 && (rows as any)[0].chkdb === 1) {
      return res.json({ success: true, message: 'Liberado para Serviço.' });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Requisitos não aceitáveis. chkdb está falso ou ausente.',
      });
    }
  } catch (error) {
    console.error('Erro ao verificar chkdb:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar chkdb.',
    });
  }
});

// rota table-count já existe no seu arquivo — deixe como está

router.get('/table-count/:table', async (req, res) => {
  const { table } = req.params;

  try {
    if (!dbSource.isInitialized) {
      await dbSource.initialize();
    }
    const queryRunner = dbSource.createQueryRunner();
    await queryRunner.connect();

    // Sanitização mínima: permitir apenas nomes esperados
    const allowed = ['systables', 'pessoas', 'empresas']; // expanda conforme necessário
    if (!allowed.includes(table)) {
      await queryRunner.release();
      return res.status(400).json({ success: false, message: 'Tabela não permitida para contagem.' });
    }

    const [rows] = await queryRunner.query(
      `SELECT COUNT(*) as cnt FROM \`${table}\``
    );
    await queryRunner.release();

    const count = rows[0]?.cnt ?? 0;
    return res.json({ success: true, table, count });
  } catch (error) {
    console.error(`Erro ao contar tabela ${table}:`, error);
    return res.status(500).json({
      success: false,
      table,
      message: 'Erro ao contar registros da tabela.',
    });
  }
});

// sincroniza tabelas do sistema (syncSysTables)
router.post('/sync-systables', async (req, res) => {
  try {
    const { requiredTables } = req.body;

    if (!Array.isArray(requiredTables) || requiredTables.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Necessário informar um array de tabelas para sincronizar.'
      });
    }

    const results = await syncSysTables(requiredTables);

    return res.status(200).json({
      success: true,
      message: 'Sincronismo das tabelas concluído.',
      tables: results
    });
  } catch (error) {
    console.error('Erro na rota /sync-systables:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao sincronizar as tabelas do sistema.'
    });
  }
});


///////////////////////////////////////////
export default router;
//////////////////////////////////////////////////
