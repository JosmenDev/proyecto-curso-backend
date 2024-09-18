import jwt from 'jsonwebtoken'
const generarJWT = (id) => {
    // sign -> crea un nuevo jwt
    return jwt.sign( { id }, process.env.JWT_SECRET, {
        // Opciones para agregar al JWT
        // Expirar el JWT
        expiresIn: "30d",

    } );
}

export default generarJWT;