import React, { useContext } from 'react'
import HeaderV from './HeaderV'
import FooterV from './FooterV'
import {
    Alert,
    Grid,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress,
} from '@mui/material';
import '../../utils/css/estructura.css';
import { HomeContext } from '../Providers/HomeContext';
import makeStyles from '@mui/styles/makeStyles';

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
    spinnerEsperando: {
        color: theme.palette.letters.main,
        width: "25px !important",
        height: "25px !important",
    },
    txtTitleDialog: {
        color: theme.palette.letters.main,
    },
    txtDescDialog: {
        fontSize: "1.1rem",
    },
}));
const EstructuraV = ({ render }) => {
    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //======= CONTEXTOS =======
    const { handleCloseAlert, alert, openModal } = useContext(HomeContext);

    return (
        <div className='estructura'>
            {/* ALERTA */}
            <Snackbar
                open={alert.status}
                autoHideDuration={2500}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                style={{
                    marginTop: '3rem',
                }}
            >
                <Alert onClose={handleCloseAlert} severity={alert.type} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>

            {/* MODAL PAGINA */}
            <Dialog
                open={openModal.open}
                aria-labelledby="Esperando"
                aria-describedby="Esprando a cargar la pagina"
            >
                <DialogTitle id="alert-dialog-title" align="center" className={classes.txtTitleDialog}>
                    {openModal.title}
                </DialogTitle>
                <DialogContent>
                    <Grid container alignItems="center" justifyContent='center' className={classes.txtDescDialog}>
                        <Grid item>
                            {openModal.message} {openModal.loading && <CircularProgress className={classes.spinnerEsperando} />}
                        </Grid>
                        <Grid item>
                            {openModal.subTitle}
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>

            <HeaderV />
            <Grid className='container'>
                {render()}
            </Grid>
            <FooterV />
        </div>
    )
}

export default EstructuraV