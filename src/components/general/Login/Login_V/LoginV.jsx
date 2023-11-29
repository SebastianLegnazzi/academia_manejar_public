import React, { useState, useContext } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import LoginC from '../Login_C/LoginC';
import {
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    InputAdornment,
    IconButton,
    FilledInput,
    FormHelperText,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import fondoLogin from '../../../../utils/img/fondo1.jpg';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';

//============== COMPONENTES ==============
import EstructuraV from '../../../estructura/EstructuraV';
import { UserContext } from '../../../Providers/UserContext';
import { useNavigate } from 'react-router-dom';
import { HomeContext } from '../../../Providers/HomeContext';


const controladorLogin = new LoginC();

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
        backgroundColor: theme.palette.background.color3,
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
    btnEnv:{
        ...theme.button,
        backgroundColor: theme.palette.btn.color3,
        color: theme.palette.letters.color5,
        '&:hover': {
            backgroundColor: theme.palette.btn.color3H,  
        },
    },
    txtCheckbox: {
        // color: theme.palette.letters.color3,
        height: '20px',
    }
}));


const LoginV = () => {

    const navigate = useNavigate();

    //======= CONTEXTOS =======
    const { setData } = useContext(UserContext);
    const { setAlert, setOpenModal } = useContext(HomeContext);

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //======= USE STATE =======
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [helpForm, setHelpForm] = useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [checked, setChecked] = React.useState(true);

    //======= USE EFFECT =======
    const login = () => {
        if (name !== '' && password !== '') {
            setOpenModal({ title: 'Iniciando sesión', message: 'Cargando datos...', open: true, loading: true });
            controladorLogin.login(name, password, checked)
                .then(resp => {
                    setOpenModal({ open: false });
                    if (resp.ok) {
                        console.log(resp)
                        setData(resp.data.user, resp.data.menues, resp.data.token);
                        console.log(resp.data.user)
                        setAlert({ message: resp.message, type: 'success', status: true })
                        navigate('/');
                    } else {
                        //console.error(resp.message)
                        setError(true);
                        setHelpForm(resp.message);
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        } else {
            setAlert({ message: 'Debe completar todos los campos', type: 'info', status: true })
        }
    };

    //Funcion que muestra o oculta la passowrd
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (event) => {
        setChecked(event.target.checked);
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
                                        <AccountCircle className={classes.icon} />
                                    </Grid>
                                    <Grid item className={classes.input}>
                                        <TextField
                                            id="nombre"
                                            label="Nombre de Usuario"
                                            variant="filled"
                                            fullWidth
                                            error={error}
                                            value={name}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    login();
                                                }
                                            }}
                                            onChange={(e) => {
                                                setError(false);
                                                setHelpForm('');
                                                setName(e.target.value)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item className={classes.input}>
                                        <FormControl style={{ width: '100%' }} variant="filled">
                                            <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
                                            <FilledInput
                                                id="outlined-adornment-password"
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
                                                        login();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setError(false);
                                                    setHelpForm('');
                                                    setPassword(e.target.value)
                                                }}
                                                error={error}
                                            />
                                            <FormHelperText className={classes.helpForm}>{helpForm}</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={checked}
                                                    onChange={handleChange}
                                                    inputProps={{ 'aria-label': 'Guardar sesion' }}
                                                    className={classes.txtCheckbox}
                                                />
                                            }
                                            label="GUARDAR SESION"
                                            className={classes.txtCheckbox}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant='contained'
                                            className={classes.btnEnv}
                                            onClick={login}
                                            size='large'>
                                            Iniciar sesión
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            className={classes.btnReg}
                                            size='small'
                                            onClick={() => navigate('/register')}
                                        >
                                            Registrarse
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            className={classes.btnReg}
                                            size='small'
                                            onClick={() => navigate('/request_email')}
                                        >
                                            Recuperar Contraseña
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

export default LoginV