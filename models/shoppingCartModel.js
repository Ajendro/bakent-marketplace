const mongoose = require('mongoose');

const ShoppingCartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario que creó el carrito
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        }
    ],
    total: { type: Number, required: true }, 
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);
