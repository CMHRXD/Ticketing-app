import { OrderStatus } from "@cmhrtools/common/build";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface OrderAttr {
  id: string;
  version: number;
  status: OrderStatus;
  userId: string;
  price: number;
}

export interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  userId: string;
  price: number;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttr): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        // This is a mongoose function that is called when a document is converted to JSON format (i.e. when we send it back to the client)
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
// Set the version key to 'version' instead of '__v'
orderSchema.set("versionKey", "version");
// Add the updateIfCurrentPlugin to the schema to handle versioning
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttr) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        status: attrs.status,
        userId: attrs.userId,
        price: attrs.price
    })
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
