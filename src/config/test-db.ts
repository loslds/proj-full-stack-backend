
import { createConnection } from 'mysql2/promise';
import 'dotenv/config';

async function testConnection() {
  try {
    const connection = await createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_DATABASE || 'jrbordados',
    });

    console.log('✅ Conexão com o MySQL bem-sucedida!');
    await connection.end();
  } catch (error: any) {
    console.error('❌ Erro ao conectar ao MySQL:', error.message);
  }
}

testConnection();

// Certifique-se que o serviço MySQL está rodando (netstat mostrou LISTENING na porta 3306, então está ok).

// No terminal, execute:

// yarn ts-node src/config/test-db.ts

// npx ts-node src/config/test-db.ts