const Category = require('../models/categoryModel');

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = new Category({ name, description });
        await newCategory.save();
        res.status(201).json({ mensaje: 'Categoría creada exitosamente', categoria: newCategory });
    } catch (error) {
        res.status(500).json({ mensaje: 'No se pudo crear la categoría: Error interno del servidor', error: error.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener categorías', error: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener categoría por ID', error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }
        res.status(200).json({ mensaje: 'Categoría actualizada exitosamente', categoria: updatedCategory });
    } catch (error) {
        res.status(500).json({ mensaje: 'No se pudo actualizar la categoría: Error interno del servidor', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }
        res.status(200).json({ mensaje: 'Categoría eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'No se pudo eliminar la categoría: Error interno del servidor', error: error.message });
    }
};
