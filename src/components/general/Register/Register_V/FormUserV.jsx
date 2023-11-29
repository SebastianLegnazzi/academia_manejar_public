import React, { useContext, useState } from 'react';
import {
    Grid,
    IconButton,
    InputAdornment,
    TextField,
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';
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
    container: {
        marginBottom: '20px',
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
    msgError: theme.typography.messageError
}));

const FormUserV = () => {

    //======= PROVIDER =======
    const { setUsername, setPassword, setPasswordRepeat, setError } = useContext(UserContext);
    const [showPassword, setShowPassword] = useState(false);

    //============================= FORMIK =================================
    const validate = values => {
        const errors = {};

        if (!values.username) {
            errors.username = 'Campo Obligatorio';
        }

        if (!values.password) {
            errors.password = 'Campo Obligatorio';
        }

        if (!values.passwordRepeat) {
            errors.passwordRepeat = 'Campo Obligatorio';
        } else if (values.password !== values.passwordRepeat) {
            errors.passwordRepeat = 'Las contraseñas no coinciden';
        }

        if (Object.keys(errors).length === 0) {
            setError(false)
            setUsername(values.username)
            setPassword(values.password)
            setPasswordRepeat(values.passwordRepeat)
        }else{
            setError(true)
        }

        return errors;
    };
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            passwordRepeat: '',
        },
        validate
    });

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
                        id="username"
                        error={formik.errors.username && formik.touched.username}
                        label="Nombre de Usuario"
                        variant="filled"
                        value={formik.values.username}
                        fullWidth
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        inputProps={{ maxLength: 25, type: 'text' }}
                        helperText={formik.errors.username && formik.touched.username ? formik.errors.username : null}
                    />

                    {}
                </Grid>
                <Grid item md={12}>
                    <TextField
                        id="password"
                        error={(formik.errors.password && formik.touched.password) || (formik.errors.passwordRepeat && formik.touched.passwordRepeat) }
                        fullWidth
                        variant="filled"
                        label="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        helperText = {formik.errors.password && formik.touched.password ? formik.errors.password : null}
                    />

                  
                </Grid>
                <Grid item md={12}>
                    <TextField
                        id="passwordRepeat"
                        fullWidth
                        error={formik.errors.passwordRepeat && formik.touched.passwordRepeat}
                        variant="filled"
                        color="letters"
                        label="Contraseña Repetida"
                        type={showPassword ? 'text' : 'password'}
                        value={formik.values.passwordRepeat}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                       helperText=  
                    {formik.errors.passwordRepeat && formik.touched.passwordRepeat ?formik.errors.passwordRepeat : null}
                    />

                </Grid>
            </Grid>
        </Grid>
    )
}

export default FormUserV