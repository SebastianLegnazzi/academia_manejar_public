import React, { useState, useEffect, useContext } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {
    Grid,
    Button,
    FormControl,
    InputLabel,
    InputAdornment,
    IconButton,
    FilledInput,
    FormHelperText,
} from '@mui/material';
import fondoLogin from '../../../../utils/img/fondo1.jpg';
import { LockReset, Visibility, VisibilityOff } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

//============== COMPONENTES ==============
import EstructuraV from '../../../estructura/EstructuraV';
import ResetPasswordC from '../Login_C/ResetPasswordC';
import { HomeContext } from '../../../Providers/HomeContext';

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
    container: {
        padding: '70px 0 70px 0',
        backgroundImage: `url(${fondoLogin})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
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
    }
}));


const controllerResetPass = new ResetPasswordC();

const ResetPasswordV = () => {
    const params = useParams();
    const navigate = useNavigate();

    const { setAlert, setOpenModal } = useContext(HomeContext);

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //======= USE STATE =======
    const [password, setPassword] = useState('');
    const [passwordR, setPasswordR] = useState('');
    const [error, setError] = useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showPasswordR, setShowPasswordR] = React.useState(false);
    const [helpForm, setHelpForm] = useState('');
    const [data, setData] = useState(null);

    //======= USE EFFECT =======
    useEffect(() => {
        controllerResetPass.verifyToken(params.token)
            .then((resp) => {
                if (resp.ok) {
                    setData(resp.data)
                    //console.log(resp.data)
                } else {
                    setOpenModal({
                        title: 'Token incorrecto!',
                        message: 'Redireccionando al inicio...',
                        subTitle: 'El token ah expirado, porfavor envielo nuevamente.',
                        open: true,
                        loading: true,
                    })
                    setTimeout(() => {
                        navigate('/')
                        setOpenModal({ title: '', message: '', open: false })
                    }, 5000);
                }
            }).catch((error) => {
                console.log(error)
            })
    }, [navigate, setOpenModal, params.token]);

    const handleResetPass = () => {
        if (password === passwordR) {
            controllerResetPass.modifyPass(password, data.idUser, data.idToken)
                .then((resp) => {
                    if (resp.ok) {
                        setAlert({
                            message: resp.message,
                            type: 'success',
                            status: true,
                        })
                        navigate('/login')
                    } else {
                        setAlert({
                            message: resp.message,
                            type: 'error',
                            status: true,
                        })
                    }
                }).catch((error) => {
                    console.log(error);
                })
        } else {
            setError(true);
            setHelpForm('Las contraseñas no coinciden');
        }
    }

    //Funcion que muestra o oculta la passowrd
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowPasswordR = () => setShowPasswordR((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <EstructuraV
            render={() => (
                <Grid item container id='login' align="center" alignContent="center" className={classes.container}>
                    <Grid item container alignItems="center">
                        <Grid item container justifyContent="center">
                            <Grid item container md={5} lg={3} justifyContent="center" alignItems="end" className={classes.inputContainer} spacing={1}>
                                <Grid item container md={9} alignContent="center" direction="column" spacing={2}>
                                    <Grid item>
                                        <LockReset className={classes.icon} />
                                    </Grid>
                                    <Grid item className={classes.input}>
                                        <FormControl style={{ width: '100%' }} variant="filled">
                                            <InputLabel htmlFor="outlined-adornment-password" color='letters'>Contraseña</InputLabel>
                                            <FilledInput
                                                id="outlined-adornment-password1"
                                                type={showPassword ? 'text' : 'password'}
                                                endAdornment={
                                                    <InputAdornment
                                                        position="end"
                                                    >
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Contraseña"
                                                value={password}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleResetPass();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setError(false);
                                                    setHelpForm('');
                                                    setPassword(e.target.value)
                                                }}
                                                error={error}
                                                color="letters"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item className={classes.input}>
                                        <FormControl style={{ width: '100%' }} variant="filled">
                                            <InputLabel htmlFor="outlined-adornment-password" color='letters'>Repetir contraseña</InputLabel>
                                            <FilledInput
                                                id="outlined-adornment-password2"
                                                type={showPasswordR ? 'text' : 'password'}
                                                endAdornment={
                                                    <InputAdornment
                                                        position="end"
                                                    >
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPasswordR}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showPasswordR ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Contraseña"
                                                value={passwordR}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleResetPass();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setError(false);
                                                    setHelpForm('');
                                                    setPasswordR(e.target.value)
                                                }}
                                                error={error}
                                                color="letters"
                                            />
                                        <FormHelperText className={classes.helpForm}>{helpForm}</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant='contained'
                                            onClick={handleResetPass}
                                            className={classes.btnEnv}
                                            size='large'>
                                            Cambiar contraseña
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        />
    )

}

export default ResetPasswordV