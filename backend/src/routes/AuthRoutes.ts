import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
// import { authenticateToken } from '../middlewares/authMiddleware'; 

const router = Router();
const authController = new AuthController(); // Instância do Controller

// --- ROTAS DE ACESSO (Públicas) ---

// [CREATE] Rota POST /api/v1/auth/register/morador (CADASTRO)
router.post('/register/morador', authController.registerMorador.bind(authController));
// [CREATE] Rota POST /api/v1/auth/login (LOGIN)
router.post('/login', authController.login.bind(authController)); 

export default router;