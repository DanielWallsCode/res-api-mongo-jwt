import { json, Router } from "express";
import { check } from "express-validator";
import { actualizarProducto, borrarProducto, crearProducto, obtenerProducto, obtenerProductos } from "../controllers/productos.js";
import { existeCategoriaPorId, existeProductoPorId} from "../helpers/db-validators.js";

import validarCampos from "../middlewares/validar-campos.js";
import validarJWT from "../middlewares/validar-jwt.js";
import {esAdminRole} from "../middlewares/validar-roles.js"


const router = Router();

// OBTENER TODOS LOS PRODUCTOS - PUBLICO
router.get('/', obtenerProductos);

// OBTENER UN PRODUCTO - PUBLICO
router.get('/:id',[
    check('id','No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

// CREAR PRODUCTO - PRIVADO - CUALQUIER PERSONA CON UN TOKEN VALIDO
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de mongo valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
]
, crearProducto);

// ACTUALIZAR - PRIVADO - CUALQUIER PERSONA CON UN TOKEN VALIDO
router.put('/:id', [
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
] ,actualizarProducto);


// ELIMINAR UNA CATEGORIA - ADMIN
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id','El id tiene que ser valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);


export  {router};