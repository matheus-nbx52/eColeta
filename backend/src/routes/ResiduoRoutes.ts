import { Router } from "express";
import { ResiduoController } from "../controllers/ResiduoController";

const router = Router();
const residuoController = new ResiduoController();


router.get('/', residuoController.index.bind(residuoController));

export default router;