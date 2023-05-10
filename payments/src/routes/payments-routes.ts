import { requireAuth, tokenMiddleware } from "@cmhrtools/common/build";
import { Router } from "express";
import { body } from "express-validator";
import { createCharge } from "../controllers";
import mongoose from "mongoose";

const paymentsRoutes = Router();

// create a charge
paymentsRoutes.post("/api/payments", tokenMiddleware, requireAuth, [
  body("token").not().isEmpty().withMessage("Empty Token"),
  body("orderId").not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)).withMessage("Invalid Order Id"),
], createCharge);


export { paymentsRoutes };