const express = require('express');

//Traemos las rutas a nuestra app
const productoRoutes = require('./routes/producto.routes')

const app = express();

app.use(express.json());
app.use('/api/productos', productoRoutes);

module.exports = app;