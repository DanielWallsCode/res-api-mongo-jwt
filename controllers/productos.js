import { response } from "express";
import Producto from "../models/producto.js";

const obtenerProductos = async(req,res = response) => {
    const {limite = 5, desde = 0} = req.query
    const query = {estado:true}
    
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario','nombre')
            .populate('categoria','nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });
}

const crearProducto = async(req,res = response) => {
    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({nombre: body.nombre});

    if(productoDB){
        return res.status(401).json({
            msg: `el producto ${productoDB} ya existe`
        });
    }

    // Generar data
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }
    
    const producto = new Producto(data);
    
    // Guardar en DB
    await producto.save();

    res.status(201).json(producto);
}

const obtenerProducto = async(req,res = response) => {
    const {id} = req.params
    const producto = await Producto.findById(id)
                            .populate('usuario','nombre')
                            .populate('categoria','nombre');

    res.json({
        msg:'Producto encontrado',
        producto
    });
}

const actualizarProducto = async(req,res = response) => {
    const {id} = req.params;
    const {estado,usuario, ...data} = req.body;

    if(data.nombre){
        data.nombre = req.body.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const productoActualizado = await Producto.findByIdAndUpdate(id,data);

    res.json({
        msg: 'Producto Actualizado',
        productoActualizado
    })

}

const borrarProducto = async(req,res = response) => {
    const {id} = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id,{estado:false});

    res.json({
        msg:'Producto borrado satisfactoriamente',
        productoBorrado
    });
}


export {
    borrarProducto,
    actualizarProducto,
    obtenerProducto,
    obtenerProductos,
    crearProducto
}