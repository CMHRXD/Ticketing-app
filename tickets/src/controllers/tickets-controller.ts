import { BadRequestError, NotAuthorizedError, NotFoundError } from "@cmhrtools/common/build";
import { Request, Response } from "express";
import { TicketCreatedPublisher } from "../events/publisher/tickets-created-publisher";
import { TicketUpdatedPublisher } from "../events/publisher/tickets-updated-publisher";
import { Ticket } from "../models/tickets-model";
import { natsClient } from "../nats-client";

async function createTicket(req: Request, res: Response) {
	if (!req.currentUser?.id) throw new NotAuthorizedError();

	const { title, price } = req.body;
	const ticket = Ticket.build({
		title,
		price,
		userId: req.currentUser!.id,
	});
	await ticket.save();
	await new TicketCreatedPublisher(natsClient.client).publish({
		id: ticket.id,
		title,
		price,
		userId: ticket.userId.toString(),
		version: ticket.version
	})
	res.status(201).json(ticket);
}

async function getTicketById(req: Request, res: Response) {
	const { id } = req.params;
	try {
		const ticket = await Ticket.findById(id);
		res.status(200).json({ ticket });
	} catch (error) {
		console.log(error);
		throw new NotFoundError();
	}
}

async function getTickets(req: Request, res: Response) {
	const tickets = await Ticket.find({ 
		orderId: undefined
	});
	res.status(200).json({ tickets });
}

async function updateTicket(req: Request, res: Response) {
	const { id } = req.params;
	const { title, price } = req.body;

	const ticket = await Ticket.findById(id);

	if (!ticket) throw new NotFoundError();
	if (req.currentUser?.id !== ticket?.userId) throw new NotAuthorizedError();

	if (ticket.orderId) throw new BadRequestError("Cannot edit a reserved ticket");

	ticket.set({ title, price });
	await ticket.save();
	await new TicketUpdatedPublisher(natsClient.client).publish({
		id,
		title,
		price,
		userId: req.currentUser.id,
		version: ticket.version
	})
	
	res.status(200).json({ ticket });
}

export { createTicket, getTickets, getTicketById, updateTicket };
