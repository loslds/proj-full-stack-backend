
// src/server.ts (ou onde for o seu ponto de entrada)

import { DataSource } from 'typeorm';
import { Application } from 'express';

export async function startServer(dbSource: DataSource, app: Application, port: number) {
  try {
    await dbSource.initialize();
    console.log('✅ Banco conectado com sucesso!');

    app.listen(port, () => {
      console.log(`🚀 Servidor rodando na porta ${port}`);
    });
  } catch (err) {
    console.error('❌ Erro ao iniciar o servidor:', err);
    process.exit(1);
  }
}




// //////////////////////////////////////////////////////////////
// import express from 'express';
// import cors from 'cors';
// import dbRoutes from './use-cases/start/dbRoutes';  
// import { errorHandler } from './services/errorHandler';

// const app = express();

// // Middleware para permitir CORS
// app.use(
//   cors({
//     origin: 'http://localhost:3000', // URL do frontend
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   })
// );

// // Permite o uso de JSON no corpo das requisições
// app.use(express.json());

// // Rotas de banco de dados (http://localhost:3001/api/db/...)
// app.use('/api/db', dbRoutes);

// // Rota raiz apenas para teste
// app.get('/', (req, res) => {
//   res.status(200).json({ success: true, message: 'Servidor online 🚀' });
// });

// // Middleware para tratar erros
// app.use(errorHandler);

// // Inicializa o servidor
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Servidor backend rodando em http://localhost:${PORT}`);
// });

