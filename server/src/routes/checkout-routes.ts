import { Router } from "express";
import { isAuth } from "@/middlewares/auth-middleware";
import { checkout, instantCheckout } from "@/controllers/checkout-controller";

const router = Router();

router.post("/", isAuth, checkout);
router.post("/instant", isAuth, instantCheckout);

export default router;
