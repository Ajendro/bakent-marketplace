const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentMethodSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email:{ type: String, required: true },
    cardNumber: { type: String, required: true },
    expiry: { type: String, required: true },
    cvc: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    zip: { type: String, required: true },
    ownerName: { type: String, },
    paymentMethodType: { 
        type: String, 
        enum: ['PayPal', 'TarjetaDeCredito'], 
        required: true 
    }
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

module.exports = PaymentMethod;
