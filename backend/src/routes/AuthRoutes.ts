import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
// import { authenticateToken } from '../middlewares/authMiddleware'; 

const router = Router();
const authController = new AuthController(); // Instância do Controller

// --- ROTAS DE ACESSO (Públicas) ---

// [CREATE] Rota POST /api/v1/auth/register/morador (CADASTRO)
router.post('/register/morador', authController.registerMorador.bind(authController));
// [CREATE] Rota POST /api/v1/auth/login (LOGIN)
router.post('/login', authController.loginMorador.bind(authController)); 

// --- ROTAS DE COOPERATIVA (A NOVA) ---
// POST http://localhost:3000/auth/register/cooperativa
router.post("/register/cooperativa", authController.registerCooperativa.bind(authController));
router.post("/login/cooperativa", authController.loginCooperativa.bind(authController));

router.post("/register/ecoletor", authController.registerEcoletor.bind(authController));
router.post("/login/ecoletor", authController.loginEcoletor.bind(authController));

export default router;