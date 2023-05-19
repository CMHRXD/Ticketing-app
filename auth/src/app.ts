import express, { json } from "express";
import "express-async-errors"; // This is a package that allows us to throw errors inside async functions
// Auth Routes
import { authRoutes } from "./routes/auth-routes";
import cookieSession from "cookie-session";

//Middlewares
import { errorHandler } from "@cmhrtools/common/build";
import { NotFoundError } from "@cmhrtools/common/build";
import cors from 'cors';

const app = express();
app.use(cors());
app.set("trust proxy", true); // trust nginx proxy in kubernetes in this case but also is used for any https
app.use(json()); // to allow express to parse json

app.use(
  cookieSession({
    signed: false, // disable encryption
    secure: process.env.NODE_ENV !== 'test', // only use cookies over https
  })
);
//process.env.NODE_ENV !== 'test' : this is to allow the cookie to be sent over http when testing

//ROUTES
app.use(authRoutes);


// Not found route
app.all("*", () => {
  throw new NotFoundError();
});

//Middlewares
app.use(errorHandler); // Error Handler

export {app}