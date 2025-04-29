const express = require('express');
const router = express.Router();
const reservaCtrl = require('../controllers/reservaController');

router.get('/init', reservaCtrl.initProductos);
router.get('/productos', reservaCtrl.listarProductos);
router.post('/', reservaCtrl.crearReserva);
router.post('/cancelar', reservaCtrl.cancelarReserva);
router.post('/tormenta', reservaCtrl.seguroTormenta);

module.exports = router;
