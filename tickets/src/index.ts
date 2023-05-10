//App
import { app } from "./app";
//Mongo DB Connection
import { mongoDBConnection } from "./config/mongoDB";
//ENV Check
import { envCheck } from "@cmhrtools/common/build";
//NATS connection
import { natsInitConnection } from "./config/nats-init";

const PORT = process.env.PORT || 4001;
const HOST = process.env.HOST || "";

// Check if all the env variables exist
envCheck();

//Mongo DB Connection
mongoDBConnection();

//Connect to NATS
natsInitConnection()

app.listen(PORT, () => {
  console.log(
    `Ticket-Service listening on: \n\tHOST:${HOST}  \n\tPORT:${PORT}`
  );
});
