import mongoose from "mongoose";


interface PaymentAttrs {
    orderId: string;
    stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
    orderId: string;
    stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema({
    orderId: {
        required: true,
        type: String
    },
    stripeId: {
        required: true,
        type: String
    }
});

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment({
        orderId: attrs.orderId,
        stripeId: attrs.stripeId
    })
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };
