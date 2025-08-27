import type { Express } from 'express';
import { appPort, frontendPort } from './config/app';
import type { DataSource } from 'typeorm';

export async function startServer(database: DataSource, httpServer: Express) {
  try {
    await database.initialize();
    console.log('✅ Banco de dados conectado com sucesso!');
    httpServer.set('dataSource', database);
    httpServer.listen(appPort, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${appPort}`);
    });  
    httpServer.listen(frontendPort, () => {
      console.log(`🚀 Frontend rodando em http://localhost:${frontendPort}`);
    });
  } catch (err) {
    console.error('❌ Falha na inicialização do servidor ou banco de dados:', err);
  }
}

 

