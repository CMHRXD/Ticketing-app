import { OrderStatus } from "@cmhrtools/common/build";
import mongoose from "mongoose";
import { Order } from "./orders-model";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface event {
  id: string;
  version: number;
}

interface ticketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface ticketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface ticketModel extends mongoose.Model<ticketDoc> {
  build(attrs: ticketAttrs): ticketDoc;
  getPreviousVersion(event: event): Promise<ticketDoc | null>;
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
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: ticketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.statics.getPreviousVersion = (event: event) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1, // we get the previous version because we want to update the current version
                                // and the current version is the event.version - 1
  })
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
        OrderStatus.Created,
        OrderStatus.Reserved,
      ],
    },
  });
  // the first ! is to check if existingOrder is null or undefined and the second ! is to check if the value is true or false
  // if existingOrder is null or undefined then the value of the function is false
  return !!existingOrder;
};

const Ticket = mongoose.model<ticketDoc, ticketModel>("Ticket", ticketSchema);

export { Ticket };
