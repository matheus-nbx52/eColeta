import { Router, Request, Response } from "express";
import { ColetaController } from "../controllers/ColetaController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { authorize } from "../middlewares/RoleMiddleware";

const router = Router();
const controller = new ColetaController();

// ============ MORADOR ============
router.post("/", authMiddleware, authorize('morador'), (req: Request, res: Response) => controller.create(req, res));
router.get("/minhas", authMiddleware, authorize('morador'), (req: Request, res: Response) => controller.minhasColetas(req, res));
router.patch("/:id/cancelar", authMiddleware, authorize('morador'), (req: Request, res: Response) => controller.cancelar(req, res));

// ============ COLETOR ============
router.get("/disponiveis", authMiddleware, authorize('ecoletor'), (req: Request, res: Response) => controller.coletasDisponiveis(req, res));
router.post("/:id/aceitar", authMiddleware, authorize('ecoletor'), (req: Request, res: Response) => controller.aceitar(req, res));
router.post("/:id/recusar", authMiddleware, authorize('ecoletor'), (req: Request, res: Response) => controller.recusar(req, res));
router.patch("/:id/iniciar-entrega", authMiddleware, authorize('ecoletor'), (req: Request, res: Response) => controller.iniciarEntrega(req, res));
router.patch("/:id/entregar", authMiddleware, authorize('ecoletor'), (req: Request, res: Response) => controller.entregar(req, res));
router.patch("/:id/cancelar-coletor", authMiddleware, authorize('ecoletor'), (req: Request, res: Response) => controller.cancelarColetor(req, res));
router.get("/coletor/dashboard", authMiddleware, authorize('ecoletor'), (req: Request, res: Response) => controller.dashboardColetor(req, res));
router.get("/coletor/historico", authMiddleware, authorize('ecoletor'), (req: Request, res: Response) => controller.historicoColetor(req, res));

// ============ COOPERATIVA ============
router.get("/coop/dashboard", authMiddleware, authorize('cooperativa'), (req: Request, res: Response) => controller.dashboardCooperativa(req, res));
router.get("/coop/historico", authMiddleware, authorize('cooperativa'), (req: Request, res: Response) => controller.historicoCooperativa(req, res));
router.patch("/:id/validar", authMiddleware, authorize('cooperativa'), (req: Request, res: Response) => controller.validar(req, res));
router.patch("/:id/cancelar-cooperativa", authMiddleware, authorize('cooperativa'), (req: Request, res: Response) => controller.cancelarCooperativa(req, res));

export default router;