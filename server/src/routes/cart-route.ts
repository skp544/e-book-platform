import {Router} from "express";
import {isAuth} from "@/middlewares/auth-middleware";
import {clearCart, getCart, updateCart} from "@/controllers/cart-controller";
import {cartItemsSchema, validate} from "@/middlewares/validate-middleware";

const router = Router()

router.post("/", isAuth, validate(cartItemsSchema) ,updateCart);

router.get("/", isAuth ,getCart);

    router.get("/clear", isAuth ,clearCart);

export  default  router;