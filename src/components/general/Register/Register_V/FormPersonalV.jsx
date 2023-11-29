import React, { useContext } from 'react';
import {
    Grid,
    TextField,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { VpnKey } from '@mui/icons-material';
import { UserContext } from '../../../Providers/UserContext';
import { useFormik } from 'formik';

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
    input: {
        display: 'flex',
        alignItems: 'center',
        width: '90%',
    },
    inputContainer: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0px 2px 20px 3px rgba(0,0,0,0.75)',
        padding: '30px 0 30px 0',
        width: '90%',
    },
    icon: {
        fontSize: '80px',
    },
    btnReg: {
        color: theme.palette.btn.main,
    },
    helpForm: {
        color: 'red',
    },
    container: {
        marginBottom: '20px',
    },
}));

const FormPersonalV = () => {
    //============================= FORMIK =================================
    const validate = values => {
        const errors = {};
        const letrasRegEx = /^[A-Za-zñÑ\s]+$/;
        if (!values.name) {
            errors.name = 'Campo Obligatorio';
        } else if (!letrasRegEx.test(values.name)) {
            errors.name = 'Debe contener solo letras';
        }
        if (!values.lastName) {
            errors.lastName = 'Campo Obligatorio';
        } else if (!letrasRegEx.test(values.lastName)) {
            errors.lastName = 'Deben contener solo letras';
        }
        if (!values.email) {
            errors.email = 'Campo Obligatorio';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Por favor ingrese un email valido';
        }
        if (Object.keys(errors).length === 0) {
            setError(false)
            setName(values.name)
            setEmail(values.email)
            setLastname(values.lastName)
        } else {
            setError(true)
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            name: '',
            lastName: '',
        },

        validate
    });


    //======= PROVIDER =======
    const { setName, setLastname, setEmail, setError } = useContext(UserContext);

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //======= VISTA =======
    return (
        <Grid item container md={10} alignContent="center" direction="column" spacing={1} className={classes.container}>
            <Grid item>
                <VpnKey className={classes.icon} />
            </Grid>
            <Grid item container spacing={2} className={classes.input} justifyContent="center">
                <Grid item md={12}>
                    <TextField
                        error={formik.errors.name && formik.touched.name}
                        label="Nombre"
                        variant="filled"
                        fullWidth
                        id="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        inputProps={{ maxLength: 20, type: 'text' }}
                        helperText={formik.errors.name && formik.touched.name ? formik.errors.name : null}
                    />
                </Grid>
                <Grid item md={12}>
                    <TextField
                        id="lastName"
                        label="Apellido"
                        variant="filled"
                        fullWidth
                        error={formik.errors.lastName && formik.touched.lastName}
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        inputProps={{ maxLength: 30, type: 'text' }}
                        helperText={formik.errors.lastName && formik.touched.lastName ? formik.errors.lastName : null}
                    />
                </Grid>
                <Grid item md={12}>
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
        </Grid>
    )
}

export default FormPersonalV