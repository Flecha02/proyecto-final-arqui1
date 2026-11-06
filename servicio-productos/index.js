const app = require('./src/app')
const sequelize = require('./src/config/database')
const PORT = process.env.PORT || 3001;


async function main() {
try {
    // Probar y sincronizar la conexión a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida con éxito.');

    // Sincroniza los modelos con la BD (crea las tablas si no existen)
    await sequelize.sync();
    console.log('Modelos sincronizados correctamente.');

    // Arrancar el servidor
    app.listen(PORT, () => {
    console.log(`Servicio de Productos corriendo en el puerto ${PORT}`);
    });
} catch (error) {
    console.error('Hay un error al conectar con la base de datos:', error.message);
}
}

main();