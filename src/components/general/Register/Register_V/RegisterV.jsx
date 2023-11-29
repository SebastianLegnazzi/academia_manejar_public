import React, { useContext, useState } from 'react';
import {
    Grid,
    Button,
    Box,
    Stepper,
    Step,
    StepLabel,
    FormHelperText,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import fondoLogin from '../../../../utils/img/fondo1.jpg';
import RegisterC from '../Register_C/RegisterC';

//============== COMPONENTES ==============
import EstructuraV from '../../../estructura/EstructuraV';
import FormPersonalV from './FormPersonalV';
import FormUserV from './FormUserV';
import { UserContext } from '../../../Providers/UserContext';
import { HomeContext } from '../../../Providers/HomeContext';
import { useNavigate } from 'react-router-dom';

//controlador para el registro
const controlRegister = new RegisterC();

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
        padding: '30px 30px 30px 30px',
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
    btnBack: {
        // color: theme.palette.letters.color5,
        backgroundColor: theme.palette.btn.color2,
        '&:hover': {
            backgroundColor: theme.palette.btn.color2H,  
        },
    }
}));

//============== Titulos de los steps ==============
const steps = ['Datos Personales', 'Datos de Usuario'];

const RegisterV = () => {

    const navigate = useNavigate();

    //======= CONTEXTOS =======
    const { name, lastname, email, username, password, error, setError } = useContext(UserContext);
    const { setAlert, setOpenModal } = useContext(HomeContext);

    //======= USE STATE =======
    const [helpForm, setHelpForm] = useState('');

    //============== funcionalidad de los steps ==============
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    //camba de seccion, va hacía la siguiente o a la última
    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);

        setError(true)
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //se encarga de verificar los datos de usuario y luego enviarlos
    const registerUserData = () => {
        setOpenModal({ title: 'Registrando Usuario', message: 'Cargando datos...', open: true, loading: true });
        setHelpForm('');

        controlRegister.register(name, lastname, email, username, password)
            .then(resp => {
                setOpenModal({ open: false });
                if (resp.ok) {
                    setAlert({ message: resp.message, type: 'success', status: true });
                    navigate('/login');
                } else {
                    setHelpForm(resp.message);
                    if (resp.message === "El campo correo electrónico ya ha sido registrado.") {
                        handleBack();
                    }
                }
            })
            .catch(err => {
                console.error(err)
            })
    };


    //======= VISTA =======
    return (
        <EstructuraV
            render={() => (
                <Grid item container id='login' align="center" alignContent="center" className={classes.container}>
                    <Grid item container alignItems="center">
                        <Grid item container justifyContent="center">
                            <Grid item container md={5} lg={5} justifyContent="center" alignItems="end" className={classes.inputContainer} spacing={1}>
                                <Box sx={{ width: '100%' }}>
                                    <Stepper activeStep={activeStep}>
                                        {steps.map((label, index) => {
                                            const stepProps = {};
                                            const labelProps = {};
                                            if (isStepSkipped(index)) {
                                                stepProps.completed = false;
                                            }
                                            return (
                                                <Step key={label} {...stepProps}>
                                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                                </Step>
                                            );
                                        })}
                                    </Stepper>
                                    {activeStep === steps.length ? (
                                        <React.Fragment>

                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            {activeStep === 0 ? (
                                                <React.Fragment>
                                                    <FormPersonalV />
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    <FormUserV />
                                                </React.Fragment>
                                            )}

                                            <Grid container justifyContent="center">
                                                <FormHelperText className={classes.helpForm}>{helpForm}</FormHelperText>
                                            </Grid>

                                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                                <Button
                                                    className={classes.btnBack}
                                                    variant='contained'
                                                    disabled={activeStep === 0}
                                                    onClick={handleBack}
                                                    sx={{ mr: 1 }}>
                                                    Volver
                                                </Button>
                                                <Box sx={{ flex: '1 1 auto' }} />

                                                {activeStep === steps.length - 1 ?

                                                    <Button onClick={registerUserData} disabled={error} variant='contained'>
                                                        Registrarme
                                                    </Button>
                                                    :
                                                    <Button onClick={handleNext} disabled={error} variant='contained'>
                                                        Siguiente
                                                    </Button>
                                                }
                                            </Box>
                                        </React.Fragment>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        />
    )
}

export default RegisterV