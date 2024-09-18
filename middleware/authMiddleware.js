// importar jwt: permite crear token y comprobarlo
import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

const checkAuth = async ( req, res, next) => {
    let token;
    // req.headers: permite capturar el token que se envia
    // se comprueba que exista el token y tambien que tenga el Bearer
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // separo la cadena por espacios y tomo el segundo valor (token)
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // select -campo nos dice que no mostrara ese campo en el select
            // req.veterinario crea una sesion con el veterinario
            req.veterinario = await Veterinario.findById(decoded.id).select(
                "-password -token -confirmado"
            );
            // Una vez en sesion, le doy en next() -> ingresar a perfil
            return next();
        } catch (error) {
            const e = new Error('Token no válido');
            return res.status(403).json( { msg: e.message});
        }
    } 

    // si se queda vacia o no hubo un toque valido
    if(!token) {
        const error = new Error('Token no válido o inexistente');
        res.status(403).json( { msg: error.message});
    }

    next();
}

export default checkAuth;