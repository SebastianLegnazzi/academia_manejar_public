import React, { useContext } from 'react';

//============== COMPONENTES ==============
import {
    Button,
    Grid,
    Skeleton,
    Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import fondo from '../../../../utils/img/header-bg.jpg';
import { HomeContext } from '../../../Providers/HomeContext';

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
    container: {
        height: '80vh',
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        objectFit: 'cover',
        backgroundPosition: 'center',
    },
    curtine: {
        backgroundColor: 'rgba(30,30,30,0.6)',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
    },
    btnPdf: {
        color: 'white',
        ...theme.button,
        backgroundColor: theme.palette.btn.color1,
        '&:hover': {
            backgroundColor: theme.palette.btn.color1H,
        },
    },
    skeleton: {
        width: 200,
        padding: "22px 0",
        backgroundColor: theme.palette.btn.color1,
    },
    btnCursos: {
        color: 'white',
        ...theme.button,
        backgroundColor: theme.palette.btn.color2,
        '&:hover': {
            backgroundColor: theme.palette.btn.color2H,
        },
    }
}));

const {
    REACT_APP_URL_STORAGE,
} = process.env;


const InicioV = () => {

    //======= CONTEXTOS =======
    const { urlInstructive } = useContext(HomeContext);

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //======= Funcion que lleva a el instructivo =======
    const openInstructive = () => {
        const pdfUrl = REACT_APP_URL_STORAGE + urlInstructive;
        window.open(pdfUrl, '_blank');
    };
    //======= VISTA =======
    return (
        <Grid item container className={classes.container} align="center" alignContent='center' id='inicio'>
            <Grid item container direction='column' className={classes.curtine}>
                <Grid item data-aos="fade-right" data-aos-duration="1500">
                    <Typography variant='h6' >
                        Querés Manejar?
                    </Typography>
                </Grid>
                <Grid item data-aos="fade-right" data-aos-duration="1500">
                    <Typography variant='h3' >
                        SACÁ TU CARNET DE CONDUCIR
                    </Typography>
                </Grid>
                <Grid item container spacing={2} justifyContent="center" data-aos="fade-up" data-aos-duration="1500">
                    <Grid item>
                        <Button
                            variant="contained"
                            size="large"
                            href="#curses"
                            className={classes.btnCursos}
                        >
                            VER CURSOS
                        </Button>
                    </Grid>
                    <Grid item>
                        {urlInstructive ? (
                            <Button
                                variant="contained"
                                size="large"
                                className={classes.btnPdf}
                                onClick={openInstructive}
                            >
                                {window.screen.width > 600 ? 'VER INSTRUCTIVO' : 'DESCARGAR INSTRUCTIVO'}
                            </Button>
                        ) :
                            (
                                <Skeleton variant="rounded" className={classes.skeleton} />
                            )
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid >
    )
}

export default InicioV