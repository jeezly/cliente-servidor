import { Router } from "express";
import { body } from "express-validator";
import { login, register } from "../controllers/authController.js";

const router = Router();

router.post(
  "/register",
  [
    body("nombre").isString().isLength({ max: 120 }),
    body("usuario").isString().isLength({ max: 120 }),
    body("correo").isEmail().isLength({ max: 120 }),
    body("password").isString().isLength({ min: 8 })
  ],
  register
);

router.post(
  "/login",
  [
    body("usuario").isString().notEmpty(),
    body("password").isString().notEmpty()
  ],
  login
);

export default router;
