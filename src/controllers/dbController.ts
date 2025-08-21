
// src/controllers/dbController.ts
import { Request, Response } from 'express';
import { checkAndInitializeSystem } from '../services/dbCheckService';

export async function checkDatabases(req: Request, res: Response) {
  try {
    const requiredTables = ['data_sys','pessoas', 'empresas']; // ajuste ou leia de config
    const result = await checkAndInitializeSystem(requiredTables);
    if (result.success) {
      return res.json({ success: true, messages: result.messages });
    } else {
      return res.status(500).json({ success: false, messages: result.messages });
    }
  } catch (err) {
    console.error('checkDatabases controller error:', err);
    return res.status(500).json({ success: false, messages: ['Erro interno no servidor'] });
  }
}
