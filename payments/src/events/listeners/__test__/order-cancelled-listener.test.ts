import mongoose from "mongoose"
import { natsClient } from "../../../nats-client"
import { OrderCancelledEvent, OrderStatus } from "@cmhrtools/common/build"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { Order } from "../../../models/order-model"

const setup = async () => {
    
    const listener = new OrderCancelledListener(natsClient.client) // natsClient.client is a mock function
    const order = await orderBuild({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: "435",
        price: 10,
        version: 0,
    })

    const data: OrderCancelledEvent["data"] = {
        id: order.id,
        version: 1,
        ticket: {
            id: "123",
        },
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    return { listener, order, data, msg }
}


describe("Order Cancelled Listener in Payments", () => {

    it("should update the status of the order and acks the message", async () => {
        const { listener, order, data, msg } = await setup()
        await listener.onMessage(data, msg)

        const updatedOrder = await Order.findById(order.id)

        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
        expect(msg.ack).toHaveBeenCalled()
    })
})