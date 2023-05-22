//ENV Check
import { envCheck } from "@cmhrtools/common/build";

//NATS connection
import { natsInitConnection } from "./config/nats-init";

// Check if all the env variables exist
envCheck();

// Connect to NATS
natsInitConnection();
