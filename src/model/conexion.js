const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bd_anuncios', 'postgres', 'admin54321', {
  host: 'postgres_bd_app',
  dialect: 'postgres'
});

async function testConexion(){
    try {
        await sequelize.authenticate();
        console.log('CONEXION CORRECTA.');
    } catch (error) {
    console.error('ERROR DE CONEXION:', error);
    }
}

testConexion();