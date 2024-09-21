import express from "express";
import conectarDB from "./config/db.js";
import dotenv from "dotenv";
import veterinarioRouters from './routes/veterinarioRoutes.js';
import pacienteRouters from './routes/pacienteRoutes.js';
import cors from 'cors';

// app contendra todas las funcionalidades para crear el servidor
const app = express();
// le decimos a app que vamos a enviar datos de tipo json
app.use(express.json());
// para poder leer las variables de entorno que defini en .env
dotenv.config();

// conectar la DB
conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, collback) {
        // si este origen, esta dentro de dominios permitidos
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            // El origen del request es permitido
            collback(null, true);
        } else {
            collback(new Error('No permitido por CORS'));
        }
    }
}

// Usar CORS
app.use(cors(corsOptions));

// cuando visitemos la URL, va a mandar a llamar veterinarioRouters
app.use('/api/veterinarios', veterinarioRouters);

// cuando visitamos la url, va a mandar a llamar a pacientesRouters
app.use('/api/pacientes', pacienteRouters);
    
// declaro mi puerto de conexion
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});