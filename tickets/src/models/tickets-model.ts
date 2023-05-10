import mongoose, { version } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttr {
	title: String;
	price: number;
	userId: String;
}

interface TicketDoc extends mongoose.Document {
	title: String;
	price: number;
	userId: String;
	version: number;
	orderId: String | null;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attr: TicketAttr): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		userId: {
			type: String,
			required: true
		},
		orderId: {
			type: String,
		}
	},
	{
		toJSON: {
			transform(doc, ret, options) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);
// this is to remove the __v field from the schem
ticketSchema.set("versionKey", "version");
// this is a mongoose plugin that will add a version field to the schema and will increment it on every update
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attr: TicketAttr) => {
	return new Ticket(attr);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Tickets", ticketSchema);

export { Ticket };
