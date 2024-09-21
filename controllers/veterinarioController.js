import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";

const registrar = async (req, res) => {
    // Leer datos del formulario: req.body
    const { email, nombre } = req.body;
    // Metodo Agregar
    // Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email});
    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }
    try {
        // Esto crea una instancia de Veterinario
        const veterinario = new Veterinario(req.body);
        // Metodo para nuevo veterinario
        const veterinarioGuardado = await veterinario.save();

        // Enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });
        res.json({msg: 'Registro nuevo correctamente ...'});
    } catch (error) {
        return res.status(500).json({msg: error.message});
    }
}

const perfil = (req, res) => {
    // console.log(req.veterinario);
    const { veterinario } = req;
    res.json( { perfil: veterinario });
}

const confirmar = async (req, res) => {
    // el params se nombra asi como se nombro en el routing
    const { token } = req.params;
    const usuarioConfirmar = await Veterinario.findOne({token});
    // si el usuario no es encontrado
    if (!usuarioConfirmar) {
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message});
    }
    // si el usuario ya existe
    try {
        // se confirma el usuario y se borra el token
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json ( { msg : "Usuario Confirmado Correctamente" } );
    } catch (error) {
        console.log(error);
    }
    
}

const autenticar = async (req, res) => {
    // req.body permite leer los datos de un formulario
    const { email, password } = req.body;

    // comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email});
    if(!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({ msg: error.message});
    } 

    // combrobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message});
    }

    // revisar el password
    if (await usuario.comprobarPassword(password)) {
        console.log('Password Correcto');
    } else {
        console.log('Password Incorrecto');
    }

    if (!await usuario.comprobarPassword(password)) {
        const error = new Error('El password es incorrecto');
        return res.status(403).json( { msg: error.message } );
    }

    // autenticar el usuario
    // cuando se autentica, genera un JWT -> Json Web Token
    res.json( {token: generarJWT(usuario.id)} );

    // res.json({ msg: 'Autenticando'});
}

const olvidePassword = async (req, res) => {
    // console.log(req.body);
    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({email});
    if (!existeVeterinario) {
        const error = new Error('El usuario no existe');
        return res.status(400).json( {msg: error.message});
    }

    // en caso exista, se genera un token
    try {
        // se le genera token y se guarda en la db en el registro que se selecciono
        existeVeterinario.token = generarId();
        await existeVeterinario.save();
        res.json({msg: "Hemos enviado un email con las instrucciones"});
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    // Para saber quien es la persona que solicita el cambio de contraseña
    const tokenValido = await Veterinario.findOne({token});
    if (tokenValido) {
        // El token es valido, el usuario existe
        res.json({msg: "Token válido y el usuario existe"});
    } else {
        const error = new Error('Token no valido');
        return res.status(400).json({msg: error.message});
    }
    console.log(tokenValido);
}

const nuevoPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        // genera un hasheado antes del save porque el password que le estamos ingresando no está modificado
        await veterinario.save();
        res.json({msg: 'password modificado correctamente'});
    } catch (error) {
        console.log(error);
    }
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
}