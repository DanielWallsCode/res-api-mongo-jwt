import { request, response } from "express";
import Usuario from "../models/usuario.js";
import bcrypjs from "bcryptjs";
import generarJWT from "../helpers/generar-jwt.js";
import googleVerify from "../helpers/google-verify.js";


const login = async(req=request,res=response) => {

    const { correo, constrasena } = req.body;

    try {

        //VERIFICAR SI EL EMAIL EXISTE
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - correo'
            });
        }
        
        // SI EL USUARIO ESTA ACTIVO
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - estado:false'
            });
        }

        // VERIFICAR LA CONTRASEÑA
        const validPassword = bcrypjs.compareSync(constrasena, usuario.constrasena);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - contraseña'
            });
        }

        // GENERAR EL JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Algo salio mal :('
        })
    }
}

const googleSignin = async(req, res = response) => {

    const { id_token } = req.body;
    
    try {
        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                constrasena: ':P',
                img,
                rol: "USER_ROLE",
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en DB
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        });
        
    } catch (error) {

        res.status(400).json({
            msg: 'Token de Google no es válido'
        })

    }



}


export {login, googleSignin}