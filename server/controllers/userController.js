import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import User from "../models/User.js";

// GET: lista (admin)
export const listUsers = async (req, res) => {
  const users = await User.find(); // <-- quitar .select("-password")
  return res.json({ success:true, users });
};

// POST: crear (admin)
export const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success:false, message:"Validación fallida", errors: errors.array() });

  const { nombre, usuario, correo, password, rol = 1, estatus = "Activo" } = req.body;
  const exists = await User.findOne({ $or: [{ usuario }, { correo }] });
  if (exists) return res.status(409).json({ success:false, message:"Usuario o correo ya existe" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ nombre, usuario, correo, password: hash, rol, estatus });
  return res.json({ success:true, user:{ id:user._id, nombre:user.nombre, usuario:user.usuario, correo:user.correo, rol:user.rol, estatus:user.estatus } });
};

// PUT: actualizar (admin)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, usuario, correo, password, rol, estatus } = req.body;

  const data = { nombre, usuario, correo, rol, estatus };
  if (password) data.password = await bcrypt.hash(password, 10);

  const updated = await User.findByIdAndUpdate(id, data, { new: true }).select("-password");
  if (!updated) return res.status(404).json({ success:false, message:"Usuario no encontrado" });

  return res.json({ success:true, user:updated });
};
