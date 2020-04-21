const Sequelize = require('sequelize');

//extraer variables de archiv env
require('dotenv').config({ path: 'variables.env' });

//console.log(`bd: ${process.env.BD_NOMBRE}, user:${process.env.BD_USER}, pass: ${process.env.BD_PASSWORD}, port: ${process.env.BD_PORT}, host: ${process.env.BD_HOST}`);

const db = new Sequelize(
    process.env.BD_NOMBRE,
    process.env.BD_USER,
    process.env.BD_PASSWORD, {
        host: process.env.BD_HOST,
        dialect: 'mysql',
        port: process.env.BD_PORT,

        define: {
            timestamps: false
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

module.exports = db;