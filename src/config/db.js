const mongoose = require('mongoose');

const db = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/alquiler_playa', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB conectado ✅');
  } catch (err) {
    console.error('Error al conectar MongoDB ❌', err);
    process.exit(1);
  }
};

module.exports = db;
