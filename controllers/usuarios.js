const {request,response} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');


const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    // const usuarios = await Usuario.find(query)
    //     .skip(desde)
    //     .limit(limite);

    // const total = await Usuario.countDocuments(query);

    // const resp = await Promise.all([
    //     Usuario.countDocuments(query),
    //     Usuario.find(query)
    //     .skip(desde)
    //     .limit(limite)
    // ]);

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(desde)
        .limit(limite)
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {

    const { nombre,correo,password,rol } = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    // Encriptar contraseña
    const salt = await bcryptjs.genSaltSync();
    usuario.password = await bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await usuario.save();

    res.json({
        msg: 'post API - controlador',
        usuario
    });
}

const usuariosPut = async(req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;

    //TODO Validar contra base de datos
    if( password ) {
        //Encriptar la contraseña
        const salt = await bcryptjs.genSaltSync();
        resto.password = await bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );
    const usuarioActualizado = await Usuario.findById(id);

    res.status(500).json(usuarioActualizado);
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch API - controlador'
    })
}

const usuariosDelete = async(req, res) => {

    const { id } = req.params;

    //Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    //Cambiar estado
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );
    const usuarioEliminado = await Usuario.findById(id);
    const usuarioAutenticado = req.usuario;

    res.json({usuarioEliminado, usuarioAutenticado})
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}