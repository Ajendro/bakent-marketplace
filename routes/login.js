const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/responseHandler');

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error al verificar el token:', err.message);
            return res.status(403).json({ message: 'Token no válido', error: err.message });
        }
        req.user = decoded;
        next();
    });
};

router.post('/login', async (req, res) => {
    try {
        const auth = await User.findOne({ email: req.body.email });
        if (!auth) {
            return res.status(404).json({ message: 'Correo o contraseña incorrectos.' });
        }

        const validPassword = await bcrypt.compare(req.body.password, auth.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
        }

        const tokenExpirationSeconds = 3600;
        const token = jwt.sign(
            { _id: auth._id },
            process.env.TOKEN_SECRET,
            { expiresIn: tokenExpirationSeconds }
        );

        const expirationDate = new Date(new Date().getTime() + tokenExpirationSeconds * 1000);

        return res.status(200).json({ token, expiration: expirationDate.toISOString(), message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error('Error en el proceso de autenticación:', error);
        return res.status(500).json({ error: error.message, message: 'Error interno del servidor' });
    }
});



router.get('/profile', async (req, res) => {
    // Obtener el token del encabezado Authorization
    const token = req.headers.authorization?.split(' ')[1]; // Formato esperado: "Bearer <token>"

    if (!token) {
        // Si no hay token, responder con un error 401 (No autorizado)
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        console.log('Token recibido:', token); // Log para verificar el token recibido

        // Verificar y decodificar el token usando la clave secreta
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log('Token decodificado:', decoded); // Log para verificar el token decodificado

        // Buscar el usuario en la base de datos por ID
        const user = await User.findById(decoded._id);

        if (!user) {
            // Si no se encuentra el usuario, responder con un error 404 (No encontrado)
            return res.status(404).json({ message: 'User not found' });
        }

        // Si todo está bien, responder con el perfil del usuario
        res.status(200).json(user);
    } catch (error) {
        // Manejar errores de verificación del token o de búsqueda del usuario
        console.error('Error verifying token or fetching user:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});


module.exports = router;