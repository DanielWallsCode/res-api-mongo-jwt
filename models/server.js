import express from "express";
import cors from 'cors';
import router from '../routes/usuarios.routes.js';
import { router as auth } from "../routes/auth.js";
import { router as categorias } from "../routes/categorias.js";
import { router as productos } from "../routes/productos.js";
import { router as buscar } from "../routes/buscar.js";
import { router as subir } from "../routes/upload.js";
import dbConnection from "../database/config.js";
import fileUpload from "express-fileupload";

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT

        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';
        this.categoriasPath = '/api/categorias';
        this.productosPath = '/api/productos';
        this.buscarPath = '/api/buscar';
        this.subirPath = '/api/subir';

        // !CONECTAR A BASE DE DATOS
        this.conectarDB();

        // MIDDLEWARES
        this.middlewares();
        // RUTAS DE MI APLICACION
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // !Lectura y Parseo del body
        this.app.use(express.json());

        // DIRECTORIO PUBLICO
        this.app.use(express.static('public'));

        // Fileupload - carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.authPath, auth);
        this.app.use(this.usuariosPath, router);
        this.app.use(this.categoriasPath, categorias);
        this.app.use(this.productosPath, productos);
        this.app.use(this.buscarPath, buscar);
        this.app.use(this.subirPath, subir);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Escuchando correctamente al puerto', this.port);
        });
    }


}

export default Server;