const Producto = require('../models/Producto');
const Reserva = require('../models/Reserva');
const dayjs = require('dayjs');  // para manejar fechas de manera optima.

//Reactifica si la fecha del turno introducida es valida
function esTurnoValido(fecha) {
  const ahora = dayjs();
  const turno = dayjs(fecha);
  return turno.isAfter(ahora) && turno.diff(ahora, 'hour') <= 48;
}

exports.initProductos = async (req, res) => {
  const count = await Producto.countDocuments();
  if (count === 0) {
    await Producto.insertMany([
      { nombre: 'JetSky', requiere: ['casco', 'chaleco'], maxPersonas: 2 },
      { nombre: 'Cuatriciclo', requiere: ['casco'], maxPersonas: 2 },
      { nombre: 'Equipo de buceo', requiere: [], maxPersonas: 1 },
      { nombre: 'Tabla de surf (niños)', requiere: [], maxPersonas: 1 },
      { nombre: 'Tabla de surf (adultos)', requiere: [], maxPersonas: 1 },
      { nombre: 'casco', esSeguridad: true },
      { nombre: 'chaleco', esSeguridad: true },
    ]);
  }
  res.json({ mensaje: 'Productos inicializados' });
};

exports.listarProductos = async (req, res) => {
  const productos = await Producto.find({ esSeguridad: { $ne: true } });
  res.json(productos);
};

exports.crearReserva = async (req, res) => {
  const { cliente, productosSolicitados, fechaInicio, turnos, pago, moneda } = req.body;
  if (!esTurnoValido(fechaInicio)) {
    return res.status(400).json({ error: 'Turnos deben tomarse con máximo 48h de anticipación.' });
  }
  if (turnos < 1 || turnos > 3) {
    return res.status(400).json({ error: 'Hasta 3 turnos consecutivos.' });
  }

  // Verrifica si los productos solicitados requieren un extra
  let extras = [];
  for (let id of productosSolicitados) {
    const p = await Producto.findById(id);
    if (p?.requiere) {
      for (let r of p.requiere) {
        const rProd = await Producto.findOne({ nombre: r });
        if (p.maxPersonas === 2) {
          extras.push(rProd._id, rProd._id);
        } else {
          extras.push(rProd._id);
        }
      }
    }
  }

  //total es en base a 100 por cada turno de cualquier producto.
  const total = [...productosSolicitados, ...extras];
  let precioBase = total.length * 100 * turnos;
  if (productosSolicitados.length > 1) precioBase *= 0.9;

  // se guarda la reseva en la base de datos
  const reserva = new Reserva({ cliente, productos: total, fechaInicio, turnos, pago, moneda, precio: precioBase });
  await reserva.save();

  res.json({ mensaje: 'Reserva creada', precio: precioBase });
};

exports.cancelarReserva = async (req, res) => {
  const { cliente, fechaInicio } = req.body;
  const ahora = dayjs();
  if (dayjs(fechaInicio).diff(ahora, 'hour') < 2) {
    return res.status(400).json({ error: 'Cancelar al menos 2 horas antes del turno.' });
  }
  await Reserva.deleteOne({ cliente, fechaInicio });
  res.json({ mensaje: 'Reserva cancelada' });
};

exports.seguroTormenta = async (req, res) => {
  const { cliente, fechaInicio } = req.body;
  const reserva = await Reserva.findOne({ cliente, fechaInicio });
  if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

  const reembolso = reserva.precio * 0.5;
  res.json({ mensaje: 'Seguro aplicado', reembolso });
};
