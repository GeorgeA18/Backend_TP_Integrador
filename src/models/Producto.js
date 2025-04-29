const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: String,
  requiere: [String], // 'casco', 'chaleco'
  maxPersonas: Number,
  esSeguridad: { type: Boolean, default: false },
});

module.exports = mongoose.model('Producto', productoSchema);
