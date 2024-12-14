import {Router} from "express";
import {isAuth} from "@/middlewares/auth-middleware";
import {getOrders, getOrderStatus} from "@/controllers/order-controller";

const router = Router()

router.get("/", isAuth, getOrders)
router.get("/check-status/:bookId", isAuth, getOrderStatus)

export  default  router;