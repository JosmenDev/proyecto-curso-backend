// importo dependencias
import mongoose from 'mongoose';
import Veterinario from './Veterinario.js';

// esquema
const pacienteSchema = mongoose.Schema( {
    nombre : {
        type: String,
        required: true
    },
    propietario: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now()
    },
    sintomas: {
        type: String,
        required: true
    },
    // Relacionar dos tablas
    veterinario: {
        // Traigo el Id
        type: mongoose.Schema.Types.ObjectId,
        // Referencio al nombre del modelo que se le colocó
        href: "Veterinario"
    }
}, {
    timestamps: true
});

const Paciente = mongoose.model('Paciente', pacienteSchema);
export default Paciente;