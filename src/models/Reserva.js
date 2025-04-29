const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  cliente: String,
  productos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producto' }],
  fechaInicio: Date,
  turnos: Number,
  pago: String,  // 'efectivo' o 'online'
  moneda: String, // 'local' o 'extranjera'
  precio: Number,
});

module.exports = mongoose.model('Reserva', reservaSchema);
