import Role from "../models/role.js";
import Usuario from "../models/usuario.js";
import Categoria from "../models/categoria.js";
import Producto from "../models/producto.js";

const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({rol});
    if(!existeRol){
            throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
    }
}

const emailExiste = async(correo = '') => {
     // VERIFICAR SI EL CORREO EXISTE
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
            throw new Error(`El Correo ${correo} ya esta registrado en la base de datos`);
    }
}

const existeUsuarioPorId = async(id) => {
        // VERIFICAR SI EL CORREO EXISTE
       const existeUsuario = await Usuario.findById(id);
       if(!existeUsuario){
               throw new Error(`El id no ${id} existe`);
       }
   }

//    CATEGORIAS

const existeCategoriaPorId = async(id) => {
    // VERIFICAR SI LA CATEGORIA EXISTE
   const existeCategoria = await Categoria.findById(id);
   if(!existeCategoria){
           throw new Error(`El id ${id} no existe`);
   }
}

// PRODUCTOS

const existeProductoPorId = async(id) => {
        // VERIFICAR SI LA CATEGORIA EXISTE
       const existeProducto = await Producto.findById(id);
       if(!existeProducto){
               throw new Error(`El id ${id} no existe`);
       }
    }
    
// Validar Colecciones Permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) =>{
        const incluida = colecciones.includes(coleccion);
        if(!incluida){
                throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
        }

        return true;
}

export {esRoleValido, emailExiste, existeUsuarioPorId, existeCategoriaPorId, existeProductoPorId, coleccionesPermitidas};