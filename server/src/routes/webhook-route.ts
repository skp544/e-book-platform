import express,{Router} from "express";
import {handlePayment} from "@/controllers/payement-controller";

const router = Router()

router.post("/", express.raw({type: "application/json"}), handlePayment)

export  default  router