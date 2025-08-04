
import type { Express } from 'express';
import { appPort } from './config/app';
import type { DataSource } from 'typeorm';

export async function startServer(database: DataSource, httpServer: Express) {
  try {
    // Inicializa o banco de dados
    await database.initialize();
    console.log('✅ Banco de dados conectado com sucesso!');

    // Inicializa o servidor HTTP
    httpServer.listen(appPort, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${appPort}`);
    });
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
  }
}

