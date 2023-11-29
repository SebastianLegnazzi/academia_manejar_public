import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {
    DirectionsCar,
    EventAvailable,
    AddModerator,
    LibraryBooks,
    VerifiedUser,
    CarRental,
} from '@mui/icons-material';

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: theme.palette.background.color6,
        minHeight: 700,
        padding: "2.5rem",
    },
    icon: {
        fontSize: 100,
        color: theme.palette.common.white,
    },
    circle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 150,
        borderRadius: '50%',
        backgroundColor: theme.palette.background.color2,
        marginBottom: '1rem',
    },
    letterColor: {
        color: theme.palette.letters.color5,
    },
    backgroundColor:{
        backgroundColor: theme.palette.background.color6,
    }
    
}));

const BenefitsV = () => {

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //======= VISTA =======
    return (
        <Grid >
            <Grid item container direction='column' align="center" className={classes.backgroundColor} paddingTop={3}>
                <Grid item>
                    <Typography className={classes.letterColor} variant='h2' sx={{ fontWeight: 600, fontSize: { xs: '30px', md: '60px' }, marginBottom: '0.5rem' }}>
                        ¿POR QUÉ ELEGIRNOS?
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography component='p' className={classes.letterColor} sx={{ fontSize: { xs: '15px', md: '20px' }, fontStyle: 'italic' }}>
                        Mirá todas los beneficios que ofrecemos para que aprendas a manejar
                    </Typography>
                </Grid>
            </Grid>
            <Grid item container className={classes.container} align="center" alignContent="center">
                <Grid item container spacing={4} justifyContent="center">
                    <Grid item xs={12} md={6} lg={4}>
                        <Paper data-aos="fade-right" className={classes.circle} elevation={6}>
                            <CarRental className={classes.icon} />
                        </Paper>
                        <Typography variant='h5' className={classes.letterColor} >
                            Seguridad
                        </Typography>
                        <Typography component='p' className={classes.letterColor} >
                            Autos habilitados con seguro especial
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <Paper data-aos="fade-down" className={classes.circle} elevation={6}>
                            <AddModerator className={classes.icon} />
                        </Paper>
                        <Typography variant='h5' className={classes.letterColor} >
                            Doble Comando
                        </Typography>
                        <Typography component='p' className={classes.letterColor} >
                            Todos nuestros vehiculos poseen doble comando.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={4} >
                        <Paper data-aos="fade-left" className={classes.circle} elevation={6}>
                            <LibraryBooks className={classes.icon} />
                        </Paper>
                        <Typography variant='h5' className={classes.letterColor} >
                            Teoria
                        </Typography>
                        <Typography component='p' className={classes.letterColor} >
                            Tendrás todo el material necesario para aprobar el examen teórico
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <Paper data-aos="fade-right" className={classes.circle} elevation={6}>
                            <VerifiedUser className={classes.icon} />
                        </Paper>
                        <Typography variant='h5' className={classes.letterColor} >
                            Intructores Capacitados
                        </Typography>
                        <Typography component='p' className={classes.letterColor} >
                            Expertos en manejo y podrán resolver tus dudas al instante.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <Paper data-aos="fade-up" className={classes.circle} elevation={6}>
                            <EventAvailable className={classes.icon} />
                        </Paper>
                        <Typography variant='h5' className={classes.letterColor} >
                            Todo el año
                        </Typography>
                        <Typography component='p' className={classes.letterColor} >
                            Clases todo el año de Lunes a viernes, horario corrido.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <Paper data-aos="fade-left" className={classes.circle} elevation={6}>
                            <DirectionsCar className={classes.icon} />
                        </Paper>
                        <Typography variant='h5' className={classes.letterColor} >
                            Variedad de vehículos
                        </Typography>
                        <Typography component='p' className={classes.letterColor} >
                            Elegí el que mas se adapte a tus necesidades.
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default BenefitsV