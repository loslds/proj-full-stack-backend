
import express from 'express';
import cors from 'cors';
import dbRoutes from './routes/dbRoutes';  // Atualize a importação para dbRoutes

import { errorHandler } from './services/errorHandler';

const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000', // URL do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.use(express.json());

// Registre as rotas do banco de dados com prefixo '/api'
app.use('/api/db', dbRoutes);  // Agora as rotas serão acessíveis via /api/db

app.use(errorHandler);  // Handler de erro

export { app as httpServer };  // Exportando o servidor http




// import express from 'express';
// import cors from 'cors';
// import dbRoutes from './routes/dbRoutes';

// export const httpServer = express();

// httpServer.use(cors());
// httpServer.use(express.json());

// httpServer.use('/api/db', dbRoutes); // 🔹 Adiciona as rotas para verificar banco e tabelas


// import express from 'express';
// import cors from 'cors';
// import { indexRoute } from './use-cases/index.route';
// import { errorHandler } from './services/errorHandler';

// const app = express();

// // Middleware
// app.use(
//   cors({
//     origin: 'http://localhost:3000', // URL do frontend
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     //allowedHeaders: ['Content-Type', 'Authorization'],
//   }),
// );
// app.use(express.json());

// app.use('/api', indexRoute); // Agora todas as rotas serão prefixadas com /api

// app.use(errorHandler)
// // Inicializar o servidor
// // app.listen(port, () => {
// //   console.log(`Servidor rodando em http://localhost:${port}`);
// // });

// export { app as httpServer };


