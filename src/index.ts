import express from 'express';
import { startServer } from './startServer';
import { appPort } from './config/app';
import { dataSource } from './database/dataSource';  // caminho correto para seu arquivo

const app = express();

startServer(dataSource, app);




// import express from 'express';

// import { DataSource } from 'typeorm';
// import { startServer } from './startServer';
// import { appPort, dbConfig } from './config/app';

// // Criar app Express
// const app = express();

// // Criar DataSource do TypeORM com as configurações
// const database = new DataSource(dbConfig);

// // Iniciar servidor e conexão
// startServer(database, app);




// console.log('Iniciando servidor...');

// import express from 'express';

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.get('/', (req, res) => {
//   res.send('Servidor funcionando!');
// });

// app.listen(PORT, () => {
//   console.log(`Servidor rodando na porta ${PORT}`);
// });






// import express from 'express';
// import { DataSource } from 'typeorm';
// import { startServer } from './startServer';
// import { appPort, dbConfig } from './config/app';

// // Criar app Express
// const app = express();

// // Criar DataSource do TypeORM com as configurações
// const database = new DataSource(dbConfig);

// // Iniciar servidor e conexão
// startServer(database, app);


// import type { Express } from 'express';
// import { appPort } from './config/app';
// import type { DataSource } from 'typeorm';

// export async function startServer(database: DataSource, httpServer: Express) {
//   try {
//     // Inicializa o banco de dados
//     await database.initialize();
//     console.log('✅ Banco de dados conectado com sucesso!');

//     // Inicializa o servidor HTTP
//     httpServer.listen(appPort, () => {
//       console.log(`🚀 Servidor rodando em http://localhost:${appPort}`);
//     });
//   } catch (error) {
//     console.error('❌ Erro ao conectar ao banco de dados:', error);
//   }
// }

