import { Router } from "express";
import { isAuth } from "@/middlewares/auth-middleware";
import {
  getOrders,
  getOrderStatus,
  getOrderSuccessStatus,
} from "@/controllers/order-controller";

const router = Router();

router.get("/", isAuth, getOrders);
router.get("/check-status/:bookId", isAuth, getOrderStatus);

router.post("/success", isAuth, getOrderSuccessStatus);

export default router;
