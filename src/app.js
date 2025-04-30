const express = require('express');
const cors = require('cors'); // previene de errors a la hora de uisar dependencias y apis externas
const bodyParser = require('body-parser'); //ayuda a la lectura de archivoc json
const db = require('./config/db');

const reservaRoutes = require('./routes/reservaRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

db(); // Conectar a la base de datos MongoDB
app.use('/api/reservas', reservaRoutes);

module.exports = app;
