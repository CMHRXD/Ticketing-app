import { Request, Response } from "express";
import { BadRequestError } from "@cmhrtools/common/build";
import { jwtGenerator } from "@cmhrtools/common/build";
import bcrypt from "bcrypt";
import { User } from "../models/user";

function currentUser(req: Request, res: Response) {
  res.status(201).json({ currentUser: req.currentUser || null });
}

async function signUp(req: Request, res: Response) {
  const { email, password } = req.body;

  const repeatedEmail = await User.findOne({ email });
  if (repeatedEmail) {
    throw new BadRequestError("Email in use");
  }

  const user = User.build({ email, password });
  await user.save();

  // Generates user Token
  const userToken = jwtGenerator(user.id, user.email);
  //Store in cookies
  req.session = {
    token: userToken,
  };

  res.status(201).send({
    id: user._id,
    email,
  });
}

async function signIn(req: Request, res: Response) {
  const { email, password } = req.body;
  //Get the user
  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError("Invalid Credentials");
  }
  //in js you dont need to add .toString() in typescript exist a diference between String and string
  if (!(await bcrypt.compare(password, user.password.toString()))) {
    throw new BadRequestError("Invalid Credentials");
  }

  //Generate Token
  const userToken = jwtGenerator(user.id, user.email);
  // Store token in cookies
  req.session = {
    token: userToken,
  };

  // Send back a response
  res.status(201).json({
    id: user.id,
    email,
  });
}

function signOut(req: Request, res: Response) {
  req.session = null;
  res.send({});
}

export { currentUser, signIn, signOut, signUp };
