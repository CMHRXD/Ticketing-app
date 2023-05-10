import {
	requireAuth,
	tokenMiddleware,
	validateRequest,
} from "@cmhrtools/common/build";
import { Router } from "express";
import { body } from "express-validator";
import {
	createTicket,
	getTicketById,
	getTickets,
	updateTicket,
} from "../controllers/tickets-controller";

const router = Router();

router.post(
	"/api/tickets",
	tokenMiddleware,
	requireAuth,
	[
		body("title").notEmpty().withMessage("Title is required"),
		body("price")
			.notEmpty()
			.withMessage("Price is required")
			.isFloat({ gt: 0 })
			.withMessage("Price has to be greater than 0"),
	],
	validateRequest,
	createTicket
);

router.get("/api/tickets/:id", getTicketById);
router.get("/api/tickets", getTickets);

router.put(
	"/api/tickets/:id",
	tokenMiddleware,
	requireAuth,
	[
		body("title").notEmpty().withMessage("Title is required"),
		body("price")
			.notEmpty()
			.withMessage("Price is required")
			.isFloat({ gt: 0 })
			.withMessage("Price has to be greater than 0"),
	],
	validateRequest,
	updateTicket
);

export { router as ticketsRoutes };
