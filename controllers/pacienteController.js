import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body);
    // Le asigno el ID del veterinario
    paciente.veterinario = req.veterinario._id; 
    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
}

const obtenerPacientes = async (req, res) => {
    try {
        const listadoPacientes = await Paciente.find()
            .where("veterinario")
            .equals(req.veterinario);
        res.json(listadoPacientes);
    } catch (error) {
        console.log(error);
    }
}

const obtenerPaciente = async (req, res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);
    if (!paciente) {
        return res.status(400).json({ msg: "Paciente no encontrado"});
    }
     // Ambos son objetos y se evaluan como diferentes siempre, entonces, tiene que convertirse en String para ser evaluados
     if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: 'Acción no válida'});
    }
    res.json(paciente);
}

const actualizarPaciente = async (req, res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);
    if (!paciente) {
        return res.status(400).json({ msg: "Paciente no encontrado"});
    }
     // Ambos son objetos y se evaluan como diferentes siempre, entonces, tiene que convertirse en String para ser evaluados
     if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: 'Acción no válida'});
    }
    
    try {
        // Modifica el nombre y si es el mismo, mantiene el mismo valor que tenia
        paciente.nombre = req.body.nombre || paciente.nombre;
        paciente.propietario = req.body.propietario || paciente.propietario;
        paciente.email = req.body.email || paciente.email;
        paciente.fecha = req.body.fecha || paciente.fecha;
        paciente.sintomas = req.body.sintomas || paciente.sintomas;

        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        res.json({mgs: error});
    }
    
    
}

const eliminarPaciente = async ( req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);
    if (!paciente) {
        return res.status(400).json({msg: "Paciente no encontrado"});
    }
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.status(400).json({msg: "Acción no válida"});
    }
    try {
        await paciente.deleteOne();
        res.json({msg: "Paciente eliminado"});
    } catch (error) {
        res.json({msg: error});
    }
}

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}