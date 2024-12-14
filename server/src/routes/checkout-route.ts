import {Router} from "express";
import {isAuth} from "@/middlewares/auth-middleware";
import {checkout} from "@/controllers/checkout-controller";

const router = Router()

router.post("/", isAuth, checkout)

export  default  router