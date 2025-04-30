
// codigo de prueba para caundo se habilite el frontend
axios.post('http://localhost:3000/api/reservas', {
        cliente: "Carlos López",
        productosSolicitados: ["ID_JETSKY", "ID_TABLA_NIÑOS"],
        fechaInicio: "2025-05-01T12:00:00Z",
        turnos: 2,
        pago: "efectivo",
        moneda: "local"
    }).then(res => console.log(res.data))
        .catch(err => console.error(err));
