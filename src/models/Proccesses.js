import pool from './../connection.js';

class ProccessesRoutes {

    async listProccesses(req, res) {

        try {
            let query = 'SELECT * FROM procesos';

            let proccessesReult = await pool.query(query);
    
            let proccesses = proccessesReult.map(result => JSON.parse(JSON.stringify(result)));
            
            res.status(200).json({resultados: proccesses});
    
        } catch (error) {

            console.log(error);
            res.status(500).json({mensaje: 'Error interno, por favor intentalo mas tarde'});
            
        }

    }

    async createProccess(req, res){

        try {
            let insertSql = 'INSERT INTO `procesos`(`nombre`) VALUES (?)';
            let insertResults = await pool.query(insertSql, [req.body.nombreProceso]);
    
            console.log(insertResults);
            res.end();

        } catch (error) {
            res.status(500).json({mensaje: 'Error interno, por favor intentalo mas tarde'});            
        }

    }

    async listarProductoPorId(req, res) {

    }

    async registrarProducto(req, res) {

    }

    async eliminarProductoPorId(req, res) {

    }

}

export default ProccessesRoutes;