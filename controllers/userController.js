const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const path = require('path');
const cloudinary = require('../config/cloudinary')



// Función para subir la imagen a Cloudinary
const uploadImageToCloudinary = async (imagePath) => {
    try {
        const result = await cloudinary.uploader.upload(imagePath);
        return result.secure_url;
    } catch (error) {
        throw new Error('Error al subir la imagen a Cloudinary: ' + error.message);
    }
};

// Crear Usuario
exports.createUser = async (req, res) => {
    try {
        const { username, phoneNumber, fullName, birthDate, gender, bio, role, email, password } = req.body;
        let profilePictureUrl = null;

        // Validar los datos del usuario
        const validRoles = ['Vendedor', 'Cliente'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Rol no válido' });
        }

        if (!username || !phoneNumber || !fullName || !email || !password || !role) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        // Validar que el email no esté ya registrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Manejo de la imagen de perfil si existe
        if (req.file) {
            profilePictureUrl = await uploadImageToCloudinary(req.file.path);
        }

        // Crear una nueva instancia de usuario
        const newUser = new User({
            username,
            phoneNumber,
            fullName,
            birthDate,
            gender,
            profilePicture: profilePictureUrl, // Guardar la URL de la imagen de perfil
            bio,
            role,
            email,
            password: hashedPassword // Guardar la contraseña hasheada
        });

        // Guardar el nuevo usuario en la base de datos
        const user = await newUser.save();

        // Enviar respuesta de éxito
        res.status(201).json({ message: 'Usuario creado exitosamente', user });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Error al crear el usuario: ' + err.message });
    }
};

// Obtener Todos los Usuarios
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Error al obtener usuarios: ' + error.message });
    }
};

// Obtener Usuario por ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user by ID:', error);
        res.status(500).json({ error: 'Error al obtener usuario por ID: ' + error.message });
    }
};

// Actualizar Usuario
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, phoneNumber, fullName, birthDate, gender, bio, role, email, password } = req.body;
        let profilePictureUrl = null;

        // Validar datos del usuario
        const validRoles = ['Vendedor', 'Cliente'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ error: 'Rol no válido' });
        }

        if (!username || !phoneNumber || !fullName || !email || !role) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        // Validar que el nuevo email no esté ya registrado
        if (email) {
            const existingUserByEmail = await User.findOne({ email });
            if (existingUserByEmail && existingUserByEmail._id.toString() !== id) {
                return res.status(400).json({ error: 'El email ya está registrado' });
            }
        }

        // Hash de la nueva contraseña si se proporciona
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Manejo de la imagen de perfil si existe
        if (req.file) {
            profilePictureUrl = await uploadImageToCloudinary(req.file.path);
        }

        // Actualizar el usuario
        const updateData = { 
            username, 
            phoneNumber, 
            fullName, 
            birthDate, 
            gender, 
            bio, 
            role, 
            email,
            profilePicture: profilePictureUrl // Actualizar la imagen de perfil
        };
        if (hashedPassword) {
            updateData.password = hashedPassword; // Solo se actualiza la contraseña si se proporciona una nueva
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado exitosamente', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: 'No se pudo actualizar el usuario: Validación fallida', details: error.message });
        } else {
            res.status(500).json({ error: 'No se pudo actualizar el usuario: Error interno del servidor', details: error.message });
        }
    }
};

// Eliminar Usuario
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'No se pudo eliminar el usuario: Error interno del servidor', details: error.message });
    }
};
