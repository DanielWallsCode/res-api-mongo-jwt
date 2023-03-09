import { json, Router } from "express";
import { check } from "express-validator";
import {crearCategoria, borrarCategoria, actualizarCategoria, obtenerCategorias, obtenerCategoria } from "../controllers/categorias.js";
import {existeCategoriaPorId} from "../helpers/db-validators.js";

import validarCampos from "../middlewares/validar-campos.js";
import validarJWT from "../middlewares/validar-jwt.js";
import {esAdminRole} from "../middlewares/validar-roles.js"


const router = Router();

// OBTENER TODAS LAS CATEGORIAS - PUBLICO
router.get('/', obtenerCategorias);

// OBTENER UNA CATEGORIA - PUBLICO
router.get('/:id',[
    check('id','No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

// CREAR CATEGORIA - PRIVADO - CUALQUIER PERSONA CON UN TOKEN VALIDO
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
]
, crearCategoria);

// ACTUALIZAR - PRIVADO - CUALQUIER PERSONA CON UN TOKEN VALIDO
router.put('/:id', [
    validarJWT,
    check('id').custom(existeCategoriaPorId),
    check('id','El id no es valido').isMongoId(),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
] ,actualizarCategoria);


// ELIMINAR UNA CATEGORIA - ADMIN
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id','El id tiene que ser valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);


export  {router};