import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/AuthRoutes';
import UserMoradorRoutes from './routes/UserMoradorRoutes';
import ResiduoRoutes from "./routes/ResiduoRoutes";
import ColetaRoutes from "./routes/ColetaRoutes";
import UserEcoletorRoutes from './routes/UserEcoletorRoutes';
import UsercooperativaRoutes from './routes/UserCooperativaRoutes';

// Middleware para parsear JSON
const app = express();
app.use(express.json());

// cors
app.use(cors());

// Rotas de autenticação
app.use('/auth', authRoutes);
// Rotas do morador
app.use('/morador', UserMoradorRoutes);
// Rotas do Ecoletor
app.use('/ecoletor', UserEcoletorRoutes);
// Rotas da cooperativa
app.use('/cooperativa', UsercooperativaRoutes);
// Rotas para coletas
app.use("/coleta", ColetaRoutes);
// Rota para listar residuo
app.use('/residuos', ResiduoRoutes);

// Iniciar o servidor após conectar ao banco de dados

initializeDatabase()
.catch((error) => console.error('Erro ao conectar ao banco de dados:', error));

app.listen(3000, () => console.log('Servidor rodando na porta 3000.'))