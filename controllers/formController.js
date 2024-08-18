const Form = require('../models/formModel');

exports.createForm = async (req, res) => {
    try {
        const { name, email,  message } = req.body;
        const newForm = new Form({ name, email,  message });
        await newForm.save();
        res.status(201).json({  message: 'Formulario creado exitosamente', formulario: newForm });
    } catch (error) {
        res.status(500).json({  message: 'No se pudo crear el formulario: Error interno del servidor', error: error.message });
    }
};

exports.getForms = async (req, res) => {
    try {
        const forms = await Form.find();
        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener formularios', error: error.message });
    }
};

exports.getFormById = async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ mensaje: 'formulario no encontrado' });
        }
        res.status(200).json(form);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener formulario por ID', error: error.message });
    }
};

exports.updateForm = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedForm = await Form.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedForm) {
            return res.status(404).json({ mensaje: 'Formulario no encontrado' });
        }
        res.status(200).json({ mensaje: 'Formlario actualizado exitosamente', formulario: updatedForm });
    } catch (error) {
        res.status(500).json({ mensaje: 'No se pudo actualizar el formulario: Error interno del servidor', error: error.message });
    }
};

exports.deleteForm = async (req, res) => {
    try {
        const deletedForm = await Form.findByIdAndDelete(req.params.id);
        if (!deletedForm) {
            return res.status(404).json({ mensaje: 'Formulario no encontrado' });
        }
        res.status(200).json({ mensaje: 'Formulario eliminadio exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'No se pudo eliminar el formulario: Error interno del servidor', error: error.message });
    }
};
