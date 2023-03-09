import { response,request } from "express";
import  jwt  from "jsonwebtoken";
import Usuario from "../models/usuario.js";

const validarJWT = async(req=request,res = response,next) => {
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg:'No hay token en la peticion'
        });
    }

    try {
        
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        // Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);
        
        if(!usuario){
            return res.status(401).json({
                msg: 'Token no valido - Usuario no existe en DB '
            })
        }
        
        // Verificar si el uid tiene estado en true
        if( !usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido - Usuario con estado en false'
            })
        }
        
        
        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'token no valido'
        })
    }
}

export default validarJWT;