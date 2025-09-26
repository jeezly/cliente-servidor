import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, maxlength: 120 },
    usuario: { type: String, required: true, unique: true, maxlength: 120 },
    correo:  { type: String, required: true, unique: true, maxlength: 120 },
    password:{ type: String, required: true, minlength: 8 },
    rol:     { type: Number, enum: [1, 2], default: 1 }, // 1 usuario, 2 admin
    estatus: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
