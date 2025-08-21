 
import { Router } from 'express';
import { dataSource } from '../database/dataSource';
import { checkDatabases } from '../controllers/dbController';



const router = Router();
// Rota nova: faz toda a checagem e cria tabelas necessárias quando não existirem
router.get('/check-databases', checkDatabases);

// Rota já existente para chkdb — recomendo ajustar para olhar 'sys_master'
router.get('/check-chkdb', async (req, res) => {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    // consultar a linha data_sys (criada pelo check-databases)
    const [rows] = await queryRunner.query(`SELECT chkdb FROM sys_data WHERE nome = 'datasys_nome' LIMIT 1`);
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

export default router;

//////////////////////////////////////////////////

router.get('/table-count/:table', async (req, res) => {
  const { table } = req.params;

  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    // Sanitização mínima: permitir apenas nomes esperados
    const allowed = ['sys_data', 'pessoas', 'empresas']; // expanda conforme necessário
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

//import { checkTables } from '../services/checkDatabase';
// // 🔍 Verifica conexão com o banco de dados
// router.get('/check-connection', async (req, res) => {
//   try {
//     if (!dataSource.isInitialized) {
//       await dataSource.initialize();
//     }
//     res.json({ success: true, message: '✅ Conectado ao banco de dados' });
//   } catch (error) {
//     console.error('❌ Erro na conexão:', error);
//     res.status(500).json({ success: false, message: '❌ Falha na conexão com o banco de dados' });
//   }
// });

// // 🔍 Verifica se as tabelas existem
// router.get('/check-tables', async (req, res) => {
//   const result = await checkTables();
//   res.json(result);
// });

// export default router;


// Checa o campo chkdb na tabela sys_data (ou tb_sys se for esse o nome)
