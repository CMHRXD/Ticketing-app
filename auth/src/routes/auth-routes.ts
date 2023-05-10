import {Router} from "express";
import { body } from "express-validator";
import { validateRequest } from "@cmhrtools/common/build";
import { tokenMiddleware } from "@cmhrtools/common/build";
import { requireAuth } from "@cmhrtools/common/build";
import {
    currentUser,
    signIn,
    signOut,
    signUp,
} from "../controllers/auth-controller";


const router = Router();

router.get("/api/users/current-user", tokenMiddleware, requireAuth , currentUser);

router.post(
    "/api/users/sign-up",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage("Password must be between 4 and 20 characters"),
    ],
    validateRequest,
    signUp
);

router.post(
    "/api/users/sign-in",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password can not be empty"),
    ],
    validateRequest,
    signIn
);

router.post("/api/users/sign-out", signOut);

export { router as authRoutes };
