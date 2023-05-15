import { app } from "./app";
//Mongo DB Connection
import { connection } from "./config/mongoDB";
//ENV Check
import { envCheck } from "@cmhrtools/common/build";

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "";

// Check if all the env variables exist
envCheck();

//Mongo DB Connection
connection();

app.listen(PORT, () => {
  console.log(`Auth-Service listening on: \n\tHOST:${HOST} \n\tPORT:${PORT}`);
});