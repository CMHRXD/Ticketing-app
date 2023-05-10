import Stripe from "stripe";

// if (!process.env.STRIPE_KEY) {
//     throw new Error("Stripe key not found");
// }

export const stripe = new Stripe("sk_test_51MyC4IGmrvuw1mJ44J9wnejfhweYOlNl64qu5sq4uVPRdkexO5jOfjuQEhUJ6lohaFjEQX5pVn7X5w1ahxeL7UJ200Irzi7ob9", {
  apiVersion: "2022-11-15",
});
