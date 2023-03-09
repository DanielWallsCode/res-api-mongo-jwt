import { Schema, model } from "mongoose";;
 
 
 
const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    correo: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    constrasena: {
        type: String,
        required: [true, 'La contraseña es Obligatoria']
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        enum: ['USER_ROLE', 'ADMIN_ROLE'],
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});
 

usuarioSchema.methods.toJSON = function(){
    const { __v,constrasena, _id, ...usuario } = this.toObject();
    usuario.iud = _id
    return usuario;
}
 
export default model('Usuario', usuarioSchema);