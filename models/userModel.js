const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    registrationDate: { type: Date, },
    fullName: { type: String, required: true },
    birthDate: { type: Date },
    gender: { type: String },
    email: {type: String,required: true,unique: true,},
    password: {type: String,required: true, },
    profilePicture: { type: String },
    bio: { type: String },
    role: { 
        type: String, 
        enum: ['Vendedor', 'Cliente'], 
        required: true 
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
