import mysql from 'mysql';
import { promisify } from 'util';

const  database = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'expressauth',
    connectionLimit: 10, // Número máximo de conexiones en el pool
}

//se crea el pool de las conexiones
const pool = mysql.createPool(database);

//se hace la conexion a la base de datos
pool.getConnection((err, connection) => {
    if (err) {
        console.error(err);
    } else {                        
        connection.release();
        console.log('db connected');
    }
});

//se convierten los callbacks en promesas
pool.query = promisify(pool.query);

export default pool;
