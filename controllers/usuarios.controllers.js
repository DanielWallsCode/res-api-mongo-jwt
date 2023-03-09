import { response,request } from "express";
import bcryptjs from "bcryptjs";
import Usuario from '../models/usuario.js';



const usuariosGet = async(req = request,res = response)=>{
    const {limite = 5, desde = 0} = req.query
    const query = {estado:true}
    
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req = request,res = response)=>{


    const {nombre,correo,constrasena,rol} = req.body;
    const usuario = new Usuario({nombre,correo,constrasena,rol});
    
    
    // ENCRIPTAR CONTRASEÑA
    const salt = bcryptjs.genSaltSync();
    usuario.constrasena = bcryptjs.hashSync(constrasena,salt);


    // GUARDAR EN BD
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async(req = request,res = response)=>{

    const {id} = req.params;
    const { _id,constrasena,google, correo, ...resto } = req.body

    // TODO: VALIDAR CONTRA BASE DE DATOS
    if(constrasena){
        // ENCRIPTAR CONTRASEÑA
        const salt = bcryptjs.genSaltSync();
        resto.constrasena = bcryptjs.hashSync(constrasena,salt);   
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({usuario});
}

const usuariosPatch = (req = request,res = response)=>{
    res.json({
        msg: 'Patch api - Controlador'
    });
}

const usuariosDelete = async(req = request,res = response)=>{

    const {id} = req.params;
    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false});


    res.json(usuario);
}




export {usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete};