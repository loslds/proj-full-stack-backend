import { Router } from 'express';
import { dataSource } from '../database/dataSource';
import { checkTables } from '../services/checkDatabase';

const router = Router();

// 🔍 Verifica conexão com o banco de dados
router.get('/check-connection', async (req, res) => {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    res.json({ success: true, message: '✅ Conectado ao banco de dados' });
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
    res.status(500).json({ success: false, message: '❌ Falha na conexão com o banco de dados' });
  }
});

// 🔍 Verifica se as tabelas existem
router.get('/check-tables', async (req, res) => {
  const result = await checkTables();
  res.json(result);
});

export default router;

