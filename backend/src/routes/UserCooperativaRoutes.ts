import { Router } from "express";
import { CooperativaController } from "../controllers/CooperativaController";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();
const cooperativaController = new CooperativaController();


router.get('/perfil', authMiddleware, cooperativaController.getProfile.bind(cooperativaController));

router.patch('/perfil', authMiddleware, cooperativaController.updateProfile.bind(cooperativaController));

router.delete('/perfil', authMiddleware, cooperativaController.deleteProfile.bind(cooperativaController));

router.get('/listar', cooperativaController.listarTodas.bind(cooperativaController));

export default router;