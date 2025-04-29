const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');

const reservaRoutes = require('./routes/reservaRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

db(); // Conectar a MongoDB
app.use('/api/reservas', reservaRoutes);

module.exports = app;
