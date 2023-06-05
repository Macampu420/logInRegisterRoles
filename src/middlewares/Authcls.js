import jwt from 'jsonwebtoken';
import pool from './../connection.js';
import bcrypt from 'bcryptjs';
import CONFIG from './../config.js';

export default class Auth{

    #checkUser = async (req, res) => {

        try {
            let username = req.body.username; 
        
            let checkQuery = 'SELECT * FROM usuarios WHERE username = ?';
    
            let checkResult = await pool.query(checkQuery, [username]);
    
            // Verificar si el conteo es mayor a cero (es decir, si el usuario ya existe)
            if (checkResult.length > 0) return true;
    
            return false;
        } catch (error) {
            console.log(error);
            return null;
        }

    }
    
    #validatePassword(clientPass, hashedPass){
        return bcrypt.compareSync(clientPass, hashedPass);
    }

    async verifyToken(req, res, next) {
        // Get the token from the authorization header
        let token = req.headers.authorization;
      
        // Check if the token exists and is not empty
        if (!token) return res.status(403).json({ message: 'Unauthorized access' }); 
      
        try {
          // Verify and decode the token asynchronously
          const decoded = await jwt.verify(token, CONFIG.secret);
          
          // Store the decoded user in the request object for later use
          req.userInfo = decoded;
      
          // Continue with the next middleware or route handler
          next();
        } catch (error) {
            console.log(error);
            return res.status(403).json({ message: 'Unauthorized access' });
        }
    } 

    async verifySuperUser(req, res, next) {
        //in config.roles finds the index of the matching user role 
        let roleIndex = CONFIG.roles.findIndex(role => role.idRol === req.userInfo.userRoleId);

        //if user.role != superUsuario the register action is forbbiden
        if(roleIndex === -1 || CONFIG.roles[roleIndex].tipoRol !== CONFIG.comparativeStrings.SuperUser){
            return res.status(403).json({mensaje: 'No tienes permisos para realizar esta accion'});
        }

        next();
    }

    async signUp(req, res){

        try {

            //if #checkUser method returns false the user is'nt created, else the user is'nt aviable
            if(await this.#checkUser(req, res))  return res.status(409).json({ mensaje: "El nombre de usuario ya está en uso. Por favor, elija otro nombre de usuario" });

            let registerQuery = 'INSERT INTO `usuarios`(`username`, `password`, `idRol`) VALUES (?,?,?)';
            let hashedPassword = bcrypt.hashSync(req.body.password, 10);
            let registerResults = await pool.query(registerQuery, [req.body.username, hashedPassword, req.body.idRol]);

            return res.status(201).json({ message: 'Registro creado exitosamente' });

        } catch (error) {
            console.log(error);
            res.status(500).json({mensaje: 'Error interno, por favor intentalo mas tarde'});                
        }

    }

    async logIn(req, res){

        if (await this.#checkUser(req, res)) {

            try {
                let logInQuery = 'SELECT usuarios.username, usuarios.idUsuario, usuarios.password, usuarios.idRol, roles.tipoRol FROM usuarios INNER JOIN roles ON usuarios.idRol = roles.idRol WHERE username = ? AND usuarios.idRol = ?';
                let logInResults = await pool.query(logInQuery, [req.body.username, req.body.idRol]);

                if ((!logInResults || !logInResults.length)) return res.status(401).json({ mensaje: "Información invalida, por favor verificar" });

                if(logInResults[0].tipoRol.toLowerCase().includes(CONFIG.comparativeStrings.Disabled.toLowerCase())) return res.status(403).json({ mensaje: "Usuario deshabilitado" });

                if (!this.#validatePassword(req.body.password, logInResults[0].password)) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

                let tokenPayload = {
                    userId: logInResults[0].idUsuario,
                    userRoleId: logInResults[0].idRol
                }

                let token = jwt.sign(tokenPayload, CONFIG.secret, { expiresIn: 86400 });

                return res.status(200).json({ token });

            } catch (error) {
                console.log(error);
                res.status(500).json({
                    mensaje: "Error interno, por favor intentalo mas tarde"
                });
            }

        } else {
            return res.status(401).json({ mensaje: "Usuario no registrado" });
        }

    }
}