import pool from './connection.js';

const selectRoles = async () => {
    let rolesQuery = 'SELECT * FROM roles';
    let rolesResults = await pool.query(rolesQuery);

    let roles = rolesResults.map((role) => {
        return {idRol: role.idRol, tipoRol: role.tipoRol}
    });

    return roles;
}

selectRoles();

const CONFIG = {
    secret: 'ñandú123',
    roles: await selectRoles(),
    comparativeStrings: {
        SuperUser: 'Super Usuario',
        User: 'Usuario',
        Disabled: 'deshabilitado'
    }
}

export default CONFIG;