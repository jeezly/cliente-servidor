import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";

const signToken = (user) => {
  return jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Crea admin por defecto si no existe (usuario: admin, pass: Admin1234)
export const ensureDefaultAdmin = async () => {
  const admin = await User.findOne({ rol: 2 });
  if (!admin) {
    const hash = await bcrypt.hash("Admin1234", 10);
    await User.create({
      nombre: "Administrador",
      usuario: "admin",
      correo: "admin@demo.com",
      password: hash,
      rol: 2,
      estatus: "Activo"
    });
    console.log("👑 Admin por defecto creado: usuario=admin, password=Admin1234");
  }
};

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success:false, message:"Validación fallida", errors: errors.array() });

  const { nombre, usuario, correo, password } = req.body;
  try {
    const exists = await User.findOne({ $or: [{ usuario }, { correo }] });
    if (exists) return res.status(409).json({ success:false, message:"Usuario o correo ya existe" });

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ nombre, usuario, correo, password: hash, rol: 1, estatus: "Activo" });
    return res.json({ success:true, user: { id:newUser._id, nombre:newUser.nombre, rol:newUser.rol } });
  } catch (e) {
    return res.status(500).json({ success:false, message:"Error al registrar", error:e.message });
  }
};

export const login = async (req, res) => {
  const { usuario, password } = req.body;
  try {
    const user = await User.findOne({ usuario });
    if (!user) return res.status(401).json({ success:false, message:"Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success:false, message:"Credenciales inválidas" });

    const token = signToken(user);
    // Respuesta según rol
    if (user.rol === 1) {
      return res.json({ success:true, message:"Bienvenido", token, rol:1 });
    } else {
      return res.json({ success:true, message:"Acceso administrador", token, rol:2 });
    }
  } catch (e) {
    return res.status(500).json({ success:false, message:"Error al iniciar sesión", error:e.message });
  }
};
