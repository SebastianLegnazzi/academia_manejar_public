import React, { useState, useContext } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {
    Grid,
    TextField,
    Button,
    FormControl,
} from '@mui/material';
import fondoLogin from '../../../../utils/img/fondo1.jpg';
import { AlternateEmail } from '@mui/icons-material';

//============== COMPONENTES ==============
import EstructuraV from '../../../estructura/EstructuraV';
import { useNavigate } from 'react-router-dom';
import { HomeContext } from '../../../Providers/HomeContext';
import ResetPasswordC from '../Login_C/ResetPasswordC';


const controladorResetPassword = new ResetPasswordC();

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
        width: '100%',
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


const RequestEmailV = () => {

    const navigate = useNavigate();

    //======= CONTEXTOS =======
    const { setAlert, setOpenModal } = useContext(HomeContext);

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //======= USE STATE =======
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    const [helpForm, setHelpForm] = useState('');

    //======= USE EFFECT =======
    const sendEmail = () => {
        if (email !== '') {
            setOpenModal({ title: 'Enviando Email', message: 'Esto puede demorar unos segudos...', open: true, loading: true });
            controladorResetPassword.sendEmail(email)
                .then(resp => {
                    setOpenModal({ open: false });
                    if (resp.ok) {
                        //console.log(resp.data)
                        setAlert({ message: resp.message, type: 'success', status: true })
                        navigate('/')
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
            setAlert({ message: 'Debe ingresar el email', type: 'info', status: true })
        }
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
                                        <AlternateEmail className={classes.icon} />
                                    </Grid>
                                    <Grid item className={classes.input}>
                                        <FormControl fullWidth>
                                            <TextField
                                                id="nombre"
                                                type='email'
                                                color="letters"
                                                label="Ingrese el Email"
                                                variant="filled"
                                                error={error}
                                                value={email}
                                                helperText={helpForm}
                                                required
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        sendEmail();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setError(false);
                                                    setHelpForm('');
                                                    setEmail(e.target.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant='contained'
                                            className={classes.btnEnv}
                                            onClick={sendEmail}
                                            size='large'>
                                            Enviar Email
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid >
            )}
        />
    )

}

export default RequestEmailV