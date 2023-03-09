import { Router } from "express";
import { check } from "express-validator";

import validarCampos from "../middlewares/validar-campos.js"
import validarJWT from "../middlewares/validar-jwt.js";
import {esAdminRole, tieneRole} from "../middlewares/validar-roles.js";


import {emailExiste, esRoleValido, existeUsuarioPorId} from "../helpers/db-validators.js";
import {usuariosDelete, 
        usuariosGet, 
        usuariosPatch, 
        usuariosPost, 
        usuariosPut}  from "../controllers/usuarios.controllers.js";


const router = Router();


router.get('/',usuariosGet);

router.post('/', [
        check('nombre','El es obligatorio').not().isEmpty(),
        check('constrasena','La constraseña es obligatoria deber ser mas de 6 letras').isLength({min:6}),
        check('correo','El correo no es valido').isEmail(),
        // check('rol','No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
        check('rol').custom(esRoleValido),
        check('correo').custom(emailExiste),
        validarCampos
] ,usuariosPost);

router.put('/:id',[
        check('id','No es un ID valido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        check('rol').custom(esRoleValido),
        validarCampos

],usuariosPut);

router.patch('/',usuariosPatch);

router.delete('/:id',[
        validarJWT,
        // esAdminRole,
        tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
        check('id','No es un ID valido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        validarCampos
],usuariosDelete);

export default router;