# Proyecto Cliente-Servidor y Serverless (1er Parcial)

## 📌 Descripción
Este proyecto implementa los estilos arquitectónicos **Cliente-Servidor**, **Serverless** y **N-Capas**.  
Incluye una base de datos en la nube (Google Cloud, Azure, AWS RDS, MongoDB Atlas, etc.), un desarrollo **Web** bajo cliente-servidor, y una arquitectura con al menos 3 capas: **Vista**, **Controlador** y **Modelo**.

---

## 🔑 Funcionalidades

1. **Pantalla de Inicio de Sesión (Login)**
   - Campos de Usuario y Contraseña.
   - Botones: *Iniciar Sesión* y *Registrarme*.
   - Usuarios:
     - **Rol = 1 (usuario regular):** muestra mensaje “Bienvenido”.
     - **Rol = 2 (administrador):** acceso a la tabla de usuarios.

2. **Formulario de Registro**
   - Permite crear un nuevo usuario con validaciones:
     - Nombre, correo y usuario ≤ 120 caracteres.
     - Contraseña ≥ 8 caracteres.
   - Por defecto, el usuario nuevo tiene **Rol = 1**.

3. **Acceso de Administrador**
   - Tabla de usuarios con opciones de:
     - Visualizar
     - Registrar
     - Editar
     - Cambiar estatus (Activo/Inactivo)

---

## ⚙️ Tecnologías
- **Frontend:** React  
- **Backend:** Node.js / Express  
- **Base de datos:** Servicio en la nube (ej. MongoDB Atlas)  
- **Arquitectura:** Cliente-Servidor + N-Capas  

---

## 👥 Integrantes
- Erick Alvarado García  
- Juan Pablo García Hernández  
- José Isaac Velázquez Martínez  

---

## 📌 Estado del Proyecto
✅ **Trabajo finalizado y funcionando**
