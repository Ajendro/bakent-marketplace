const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FormSchema = new mongoose.Schema({
  name: {type: String,required: true, },
  email: {type: String,required: true, unique: true },
  message: {type: String, required: true, }
});

const Form = mongoose.model('Form', FormSchema);

module.exports = Form;