
import type { Express } from 'express';
import { appPort } from './config/app';
import type { DataSource } from 'typeorm';

export async function startServer(database: DataSource, httpServer: Express) {
  // innicializa o banco
  await database.initialize();
  console.log('Banco de dados conectado com sucesso!');
  
  // Disponibiliza o DataSource no app para ser usado nas rotas
  httpServer.set('dataSource', database);
  
  // inicializa o servidor Http
  httpServer.listen(appPort, () => {
    console.log(`Servidor rodando em http://localhost:${appPort}`);
  });
}

