import * as dotenv from 'dotenv';
dotenv.config()
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import {v2} from 'cloudinary'
const cloudinary = v2;

const callCloudinary = () => {
    cloudinary.config({
        cloud_name:'dapkzvqvv',
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });
    return cloudinary;
}


import { response, request } from 'express';
import subirArchivo from '../helpers/subir-archivo.js';
import Producto from '../models/producto.js';
import Usuario from '../models/usuario.js';

 
const cargarArchivo = async(req = request, res = response) => {

    try {
        const nombre = await subirArchivo(req.files, undefined,'imgs');
      
        res.json({nombre})
        
    } catch (msg) {
        res.status(400).json({
            msg
        })
    }

    // imagenes
};
 

const actualizarImagen = async(req,res = response) => {

    const {id,coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            
        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
    }

    // Limpiar imagenes previas
    if(modelo.img){
        // Haay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined,coleccion);
    modelo.img = nombre

    await modelo.save();

    res.json(modelo);
}


const actualizarImagenCloudinary = async(req,res = response) => {

    const {id,coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            
        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
    }

    // Limpiar imagenes previas
    if(modelo.img){
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        callCloudinary().uploader.destroy(public_id);

    }

    const {tempFilePath} = req.files.archivo;
    const { secure_url } = await callCloudinary().uploader.upload(tempFilePath);
    modelo.img = secure_url;

    await modelo.save();

    res.json(modelo);
}



const mostrarImagen = async(req,res=response) => {

    const {id,coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            
        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
    }

    // Limpiar imagenes previas
    if(modelo.img){
        // Haay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen)
        }
    }

    
    const pathHolder = path.join(__dirname, '../assets', 'no-image.jpg');
    res.sendFile(pathHolder);
}
 
export {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}