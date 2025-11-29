import express from 'express';
import { initializeDatabase } from './config/database';

const app = express();
app.listen(3000, () => console.log('Servidor rodando na porta 3000.'))

initializeDatabase().catch((error) => console.error('Erro ao conectar ao banco de dados:', error));

