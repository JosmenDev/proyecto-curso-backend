// import dependencias
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
// import archivos creados
import generarId from '../helpers/generarId.js';
// definir el esquema que va a tener el veterinario
const veterinarioSchema = mongoose.Schema({
    nombre: {
        // Tipo de dato
        type: String,
        // Informacion requerida
        required: true,
        // Validar espacios en blanco adicionales
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        // tributo unico
        unique: true
    },
    telefono: {
        type: String,
        // valor por defecto null
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        // Valor unico por defecto
        default: generarId()
    },
    confirmado: {
        // para confirmar cuenta
        type: Boolean,
        default: false
    }
});

// pre: se ejecuta antes del metodo save
veterinarioSchema.pre( 'save' , async function(next) {
    // validar en caso un password ya esta hasheado, ya no lo haga
    if (!this.isModified("password")) {
        next();
    }
    
    // this trae el objeto con los datos del usuario
    // genSalt son como rondas de hasheo - 10 es el default
    const salt = await bcrypt.genSalt(10);
    // aync await porque se tiene que detener el servidor en lo que se genera el salt

    // Generar el hash
    this.password = await bcrypt.hash(this.password, salt);
});

// methods registra funciones que solo funcione en este esquema
veterinarioSchema.methods.comprobarPassword = async function (
    passwordFormulario
) {
    // comprueba la igualdad del termino ingresado con el termino hasheado
    // retorna true o false
    return await bcrypt.compare(passwordFormulario, this.password);
}

// Queda registrado como modelo en la BD
// 1° Le decimos que vamos a trabajar con el modelo Veterinario
// 2° Le pasamos el esquema para indicarle la forma en la que estan los datos
const Veterinario = mongoose.model('Veterinario', veterinarioSchema);
export default Veterinario; 