import mongoose from "mongoose";

// funcion para conectar mongoDB
const conectarDB = async () => {
    try {
        // moongoose.conect permite conectar a la DB
        const db = await mongoose.connect(process.env.MONGO_URI);
        // capturo el valor del host (url) y del puerto
        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MongoDB conectado en: ${url}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        // Imprime un mensaje de error
        process.exit(1);
    }
}

export default conectarDB;