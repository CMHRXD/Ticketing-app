import nats, { Stan } from "node-nats-streaming";

class NatsClient {
  
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before conecting");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    //When you call the variable this.client instead of this._client you are calling the get method.
    return new Promise((resolve, rejects) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });

      this.client.on("error", (err) => {
        return rejects(err);
      });
    }) as Promise<void>;
  }
}

export const natsClient = new NatsClient();
