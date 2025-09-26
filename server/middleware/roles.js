export const onlyAdmin = (req, res, next) => {
  if (req.user?.rol !== 2) {
    return res.status(403).json({ success:false, message:"Acceso solo para administradores" });
  }
  next();
};
