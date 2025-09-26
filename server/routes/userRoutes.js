import { Router } from "express";
import { body } from "express-validator";
import { listUsers, createUser, updateUser } from "../controllers/userController.js";
import { authRequired } from "../middleware/auth.js";
import { onlyAdmin } from "../middleware/roles.js";

const router = Router();

router.get("/", authRequired, onlyAdmin, listUsers);

router.post(
  "/",
  authRequired,
  onlyAdmin,
  [
    body("nombre").isString().isLength({ max: 120 }),
    body("usuario").isString().isLength({ max: 120 }),
    body("correo").isEmail().isLength({ max: 120 }),
    body("password").isString().isLength({ min: 8 }),
    body("estatus").optional().isIn(["Activo", "Inactivo"]),
    body("rol").optional().isIn([1, 2])
  ],
  createUser
);

router.put(
  "/:id",
  authRequired,
  onlyAdmin,
  [
    body("nombre").optional().isString().isLength({ max: 120 }),
    body("usuario").optional().isString().isLength({ max: 120 }),
    body("correo").optional().isEmail().isLength({ max: 120 }),
    body("password").optional().isString().isLength({ min: 8 }),
    body("estatus").optional().isIn(["Activo", "Inactivo"]),
    body("rol").optional().isIn([1, 2])
  ],
  updateUser
);

export default router;
