import { Router } from "express";
import { MoradorController } from "../controllers/MoradorController";

const router = Router();
const moradorController = new MoradorController(); // Instância do Controller

// [READ] Rota GET /api/v1/morador/perfil (Buscar dados do Morador logado)
router.get('/perfil', moradorController.getProfile.bind(moradorController));

// [UPDATE] Rota PUT /api/v1/morador/perfil (Atualizar dados básicos)
router.patch('/perfil', moradorController.updateProfile.bind(moradorController));

// [DELETE] Rota DELETE /api/v1/morador/perfil (Deletar conta)
router.delete('/perfil', moradorController.deleteProfile.bind(moradorController));

export default router;