import { Router } from "express";
import {
  requireAuth,
  tokenMiddleware,
  validateRequest,
} from "@cmhrtools/common/build";
import {
  getOrders,
  getOrderById,
  createOrder,
  deleteOrder,
} from "../controllers/orders-controller";
import { body, param } from "express-validator";
import mongoose from "mongoose";

const router = Router();

router.get("/api/orders", tokenMiddleware, requireAuth, getOrders);

router.get(
  "/api/orders/:id",
  tokenMiddleware,
  requireAuth,
  [
    param("id")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Invalid Order Id"),
  ],
  validateRequest,
  getOrderById
);

router.post(
  "/api/orders",
  tokenMiddleware,
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Invalid ticket Id"),
  ],
  validateRequest,
  createOrder
);

router.delete(
  "/api/orders/:id",
  tokenMiddleware,
  requireAuth,
  [
    param("id")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Invalid Order Id"),
  ],
  validateRequest,
  deleteOrder
);

export { router as ordersRoutes };
