const ShoppingCart = require('../models/shoppingCartModel');

exports.createShoppingCart = async (req, res) => {
    try {
        const { user, cartItems, total } = req.body;

        // Verifica que se envíen los elementos del carrito
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: 'El carrito de compras no puede estar vacío.' });
        }

        // Verifica que el ID del usuario esté disponible
        if (!user) {
            return res.status(400).json({ message: 'ID de usuario no disponible.' });
        }

        // Crea un nuevo carrito de compras
        const newShoppingCart = new ShoppingCart({
            user,
            products: cartItems.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),
            total: total
        });

        await newShoppingCart.save();
        res.status(201).json({ message: 'Carrito de compras creado exitosamente', shoppingCart: newShoppingCart });
    } catch (error) {
        console.error('Error al crear el carrito de compras:', error);
        res.status(500).json({ message: 'No se pudo crear el carrito de compras: Error interno del servidor', error: error.message });
    }
};


// Obtener todos los carritos de compras
exports.getAllShoppingCarts = async (req, res) => {
    try {
        const shoppingCarts = await ShoppingCart.find().populate('user', 'name'); // Opcional: incluir detalles del usuario
        res.status(200).json(shoppingCarts);
    } catch (error) {
        res.status(500).json({ message: 'No se pudo obtener los carritos de compras: Error interno del servidor', error: error.message });
    }
};

// Obtener un carrito de compras por su ID
exports.getShoppingCartByUserId = async (req, res) => {
    try {
        // Obtener el ID del usuario desde los parámetros de la URL
        const userId = req.params.userId;
        
        if (!userId) {
            return res.status(400).json({ message: 'ID de usuario no proporcionado.' });
        }

        // Buscar el carrito de compras del usuario
        const shoppingCart = await ShoppingCart.findOne({ user: userId });

        // Verificar si se encontró el carrito de compras
        if (!shoppingCart) {
            return res.status(404).json({ message: 'Carrito de compras no encontrado.' });
        }

        // Responder con el carrito de compras
        res.status(200).json({ shoppingCart });
    } catch (error) {
        console.error('Error al obtener el carrito de compras:', error);
        res.status(500).json({ message: 'No se pudo obtener el carrito de compras: Error interno del servidor', error: error.message });
    }
};


// Actualizar un carrito de compras por su ID
exports.updateShoppingCart = async (req, res) => {
    try {
        const { cartItems, total } = req.body;

        // Verifica que se envíen los elementos del carrito
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: 'El carrito de compras no puede estar vacío.' });
        }

        const updatedShoppingCart = await ShoppingCart.findByIdAndUpdate(
            req.params.id,
            {
                products: cartItems.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity
                })),
                total: total // Actualiza el total
            },
            { new: true, runValidators: true }
        );

        if (!updatedShoppingCart) {
            return res.status(404).json({ message: 'Carrito de compras no encontrado' });
        }

        res.status(200).json({ message: 'Carrito de compras actualizado exitosamente', shoppingCart: updatedShoppingCart });
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: 'No se pudo actualizar el carrito de compras: Validación fallida', error: error.message });
        } else {
            res.status(500).json({ message: 'No se pudo actualizar el carrito de compras: Error interno del servidor', error: error.message });
        }
    }
};

// Eliminar un carrito de compras por su ID
exports.deleteShoppingCart = async (req, res) => {
    try {
        const deletedShoppingCart = await ShoppingCart.findByIdAndDelete(req.params.id);

        if (!deletedShoppingCart) {
            return res.status(404).json({ message: 'Carrito de compras no encontrado' });
        }

        res.status(200).json({ message: 'Carrito de compras eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'No se pudo eliminar el carrito de compras: Error interno del servidor', error: error.message });
    }
};

    
exports.getCartsByAuthenticatedUser = async (req, res) => {
    try {
        const { userId } = req.body; // Obtener el ID del usuario del cuerpo de la solicitud

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const carts = await ShoppingCart.find({ user: userId });

        if (!carts.length) {
            return res.status(404).json({ message: 'No carts found for the authenticated user' });
        }

        res.json(carts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

