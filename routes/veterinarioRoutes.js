import express from 'express';
import { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword } from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

// Para trabajar con las rutas que van relacionados a veterinarios
const router = express.Router();

// RUTAS PARA EL AREA PUBLICA
// registrar
router.post('/', registrar);
// : permite agregar un parámetro dinamico
router.get('/confirmar/:token', confirmar);
// autenicar
router.post('/login', autenticar);
// validar el email del usuario
router.post('/olvide-password', olvidePassword);
// abra el cambiar password y leer el token
// router.get('/olvide-password/:token', comprobarToken);
// define password nuevo
// router.post('/olvide-password/:token', nuevoPassword);
// resumir sintaxis de la misma direccion pero con metodos distintos
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

// PAGINAS CON EL USUARIO YA AUTENTICADO
// verifico con el middleware ssi es que el usuario que es y en base a ello, mostrarle informacion que le corresponde
router.get('/perfil', checkAuth, perfil);


export default router;
