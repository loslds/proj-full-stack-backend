// src/use-cases/start/dbRoutes.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { requiredTables } from '../../system/tables';
import { syncsysTables } from '../../services/syncsysTables';

const router = Router();

/**
 * 🔎 Verifica se a tabela systables existe e retorna count
 */
router.get('/check-systables', async (_req, res) => {
  try {
    const result = await AppDataSource.query(
      'SELECT COUNT(*) AS total FROM systables'
    );

    return res.json({
      success: true,
      table: 'systables',
      total: result[0].total,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar tabela systables',
      error: error.message,
    });
  }
});

/**
 * 🚀 Executa sincronização completa do sistema
 * (usa requiredTables internamente)
 */
router.post('/sync-systables', async (_req, res) => {
  try {
    const result = await syncsysTables();

    return res.json({
      success: true,
      message: 'Sincronização concluída',
      result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao sincronizar tabelas',
      error: error.message,
    });
  }
});

/**
 * 📊 Conta registros de uma tabela permitida
 */
router.get('/table-count/:table', async (req, res) => {
  const { table } = req.params;

  if (!requiredTables.includes(table)) {
    return res.status(400).json({
      success: false,
      message: 'Tabela não permitida',
    });
  }

  try {
    const result = await AppDataSource.query(
      `SELECT COUNT(*) AS total FROM \`${table}\``
    );

    return res.json({
      success: true,
      table,
      total: result[0].total,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao contar registros',
      error: error.message,
    });
  }
});

export default router;
