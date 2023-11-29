import React, { useContext, useState } from 'react'
import makeStyles from '@mui/styles/makeStyles';
import { Button, Grid, TextField, Typography } from '@mui/material';
import fondo from '../../../../utils/img/mapa.jpg';
import {
    AccountCircle,
    Email,
    PhoneEnabled,
} from '@mui/icons-material';
import ContactC from '../Home_C/ContactC';
import { HomeContext } from '../../../Providers/HomeContext';
import { useFormik } from 'formik';

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
    container: {
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    curtine: {
        backgroundColor: 'rgba(30,30,30,0.6)',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        padding: '50px 0 50px 0',
    },
    inputContainer: {
        marginTop: '20px',
        backgroundColor: theme.palette.background.color3,
        borderRadius: '20px',
        boxShadow: '0px 2px 20px 3px rgba(0,0,0,0.75)',
        padding: '30px 0 30px 0',
    },
    input: {
        display: 'flex',
        alignItems: 'center',
        width: '90%',
    },
    txtMensaje: {

        width: '90%',
        paddingRight: '30px',
        [theme.breakpoints.down('md')]: {
            paddingRight: '0',
        },
    },
    txtHeader: {
        color: '#52717d',
        fontSize: '1.2rem',
        fontStyle: 'italic',
    },
    header: {
        marginBottom: '20px',
    },
    btnEnv: {
        marginTop: '20px',
        backgroundColor: theme.palette.btn.color3,
        color: theme.palette.letters.color5,
        '&:hover': {
            backgroundColor: theme.palette.btn.color3H,
        },
    },
    msgError1: theme.typography.messageError,
    msgError: {
        ...theme.typography.messageError,
        marginLeft: '30px',
    },
    inputText: {
        color: 'black !important',


    }
}));

const controllerContact = new ContactC();

const ContactV = () => {
    //============================= FORMIK =================================
    const validate = values => {
        const errors = {};
        const letrasRegEx = /^[A-Za-zñÑ\s]+$/;
        const numRegEx = /^[0-9]+$/;

        if (!values.name) {
            errors.name = 'Campo Obligatorio';
        } else if (!letrasRegEx.test(values.name)) {
            errors.name = 'Debe contener solo letras';
        }

        if (!values.telefono) {
            errors.telefono = 'Campo Obligatorio';
        } else if (!numRegEx.test(values.telefono)) {
            errors.telefono = 'Deben contener solo letras';
        }

        if (!values.email) {
            errors.email = 'Campo Obligatorio';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Por favor ingrese un email valido';
        }

        if (!values.mensaje) {
            errors.mensaje = 'Campo Obligatorio';
        } else if (values.mensaje.length <= 5) {
            errors.mensaje = 'Por favor ingrese al menos más de 5 caracteres';
        }

        if (Object.keys(errors).length === 0) {
            setError(false)
        } else {
            setError(true)
        }

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            name: '',
            telefono: '',
            mensaje: '',
        },
        validate
    });


    //======= CONTEXTOS =======
    const { setAlert } = useContext(HomeContext);

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //======= USE STATE =======
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [telefono, setTelefono] = useState('');
    const [error, setError] = useState(true);

    //Funcion que envia el email
    const sendEmail = () => {
        if (name !== '' && email !== '' && message !== '' && telefono !== '') {
            setAlert({ message: 'Enviando...', type: 'info', status: true });
            controllerContact.sendEmail(name, email, message, telefono)
                .then(resp => {
                    if (resp.ok) {
                        setAlert({ message: 'Email enviado correctamente', type: 'success', status: true });
                        setName('');
                        setEmail('');
                        setMessage('');
                        setTelefono('');
                        setError(false);
                    } else {
                        setError(true);
                        setAlert({ message: 'Error al enviar email, intentelo nuevamente mas tarde.', type: 'error', status: true });
                        console.error(resp.message)
                    }
                })
        } else {
            setError(true);
            setAlert({ message: 'Complete todos los campos', type: 'error', status: true });
        }
    }

    return (
        <Grid container className={classes.container} id='contact'>
            <Grid item container className={classes.curtine} alignItems="center">
                <Grid item container justifyContent="center">
                    <Grid item container md={12} justifyContent="center" align="center" direction="column">
                        <Grid item>
                            <Typography variant='h3' className={classes.header} >
                                CONTACTO
                            </Typography>
                            <Typography variant='p' className={classes.txtHeader} >
                                Responderemos a la brevedad
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item container md={6} justifyContent="center" alignItems="end" className={classes.inputContainer} spacing={1}>
                        <Grid item container md={6} alignContent="center" direction="column" spacing={2}>
                            <Grid item container >
                                <Grid item className={classes.input}>
                                    <AccountCircle sx={{ mr: 1, my: 0.5 }} />
                                    <TextField
                                        className={classes.inputText}
                                        id="name"
                                        label="Nombre"
                                        variant="filled"
                                        fullWidth
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.errors.name && formik.touched.name}
                                        inputProps={{ maxLength: 20, type: 'text' }}
                                        helperText={formik.errors.name && formik.touched.name ? formik.errors.name : null}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container>
                                <Grid item className={classes.input}>
                                    <Email sx={{ mr: 1, my: 0.5 }} />
                                    <TextField
                                        id="email"
                                        label="Email"
                                        variant="filled"
                                        type="email"
                                        fullWidth
                                        error={formik.errors.email && formik.touched.email}
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        inputProps={{ maxLength: 200, type: 'email' }}
                                        helperText={formik.errors.email && formik.touched.email ? formik.errors.email : null}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container>
                                <Grid item className={classes.input}>
                                    <PhoneEnabled sx={{ mr: 1, my: 0.5 }} />
                                    <TextField
                                        id="telefono"
                                        label="Telefono"
                                        variant="filled"
                                        type="text"
                                        fullWidth
                                        error={formik.errors.telefono && formik.touched.telefono}
                                        value={formik.values.telefono}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        inputProps={{ maxLength: 15 }}
                                        helperText={formik.errors.telefono && formik.touched.telefono ? formik.errors.telefono : null}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={6} className={classes.txtMensaje}>
                            <TextField
                                id="mensaje"
                                multiline
                                label="Mensaje"
                                rows={7}
                                variant="filled"
                                placeholder="Ingrese una descripcion"
                                type="text"
                                fullWidth
                                error={formik.errors.mensaje && formik.touched.mensaje}
                                value={formik.values.mensaje}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                inputProps={{ maxLength: 200 }}
                                helperText={formik.errors.mensaje && formik.touched.mensaje ? formik.errors.mensaje : null}
                            />
                        </Grid>
                        <Button
                            variant='contained'
                            className={classes.btnEnv}
                            size='large'
                            disabled={error}
                            onClick={sendEmail}
                        >
                            Enviar
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default ContactV