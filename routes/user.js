
const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole, tieneRole  } = require('../middlewares');

const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRolValido ),
    validarCampos
],
usuariosPut);

router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El password debe ser más de 6 letras').isLength({ min: 6 }),
    check('correo','El correo no es válido').isEmail(),
    check('correo','El correo no es válido').custom( emailExiste ),
    // check('rol','No es un rol válido').isIn(['ADMIN_ROL','USER_ROL']),
    check('rol').custom( esRolValido ),
    validarCampos
],usuariosPost);

router.delete('/:id',[
    validarJWT,
    // esAdminrole,
    tieneRole('ADMIN_ROLE','USER_ROLE'),
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],usuariosDelete);

router.patch('/', usuariosPatch);



module.exports = router;

