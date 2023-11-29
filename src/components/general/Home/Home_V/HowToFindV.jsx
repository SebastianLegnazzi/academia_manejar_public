import React from 'react'

//============== COMPONENTES ==============
import { Button, Grid, Paper, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {
    LocationOn,
    WhatsApp,
    Email
} from '@mui/icons-material';

//============== LEAFLET ==============
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
//import markerIcon from "../../../../utils/img/location.svg"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import shadowIcon from "leaflet/dist/images/marker-shadow.png"
import { Icon } from 'leaflet'

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
    container: {
        height: '80vh',
        [theme.breakpoints.down('xl')]: {
            height: 'auto',
            padding: '20px 0 20px 0',
        },
        background: theme.background.style3,
    },
    mapaContainer: {
        width: '850px',
        height: '500px',
        [theme.breakpoints.down('lg')]: {
            width: '800px',
            height: '500px',
        },
        [theme.breakpoints.down('md')]: {
            width: '580px',
            height: '500px',
        },
        [theme.breakpoints.down('sm')]: {
            width: '350px',
            height: '330px',
        },
        borderRadius: '10px',

    },
    mapa: {
        width: '100%',
        height: '100%',
        borderRadius: '10px',

    },
    txtPrimary: {
        fontSize: '2.2rem',
        fontWeight: 'bold',
        textAlign: 'center',
        color: theme.palette.letters.main,
        [theme.breakpoints.down('sm')]: {
            fontSize: '1.3rem',
        },
    },
    txtSecondary: {
        fontSize: '1rem',
        [theme.breakpoints.down('md')]: {
            fontSize: '0.9rem',
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.7rem',
        },
    },
    icon: {
        fontSize: '1.3rem',
        marginRight: '10px',
        [theme.breakpoints.down('sm')]: {
            fontSize: '1rem',
        }
    },
    iconLocation: {
        width: '20px',
        height: '20px',
        color: '#db1b1b',
    },
    button: {
        ...theme.button,
        backgroundColor: theme.palette.btn.color1,
    },
    containerTxt: {
        backgroundColor: 'rgba(87,87,87,0.2)',
        borderRadius: '10px',
        paddingBottom: '20px',
        boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.50)',
        margin: 'auto',
        width: '90%',
        [theme.breakpoints.down('sm')]: {
            marginTop: '10px',
            width: '90%',
        },
    },
}));

const HowToFindV = () => {
    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //======= Funcion que lleva a ver la direccion a googlemaps =======
    const openGoogleMaps = () => {
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Academia Manejar, Cipolletti, Rio Negro')}`;
        window.open(googleMapsUrl, '_blank');
    };

    //======= Funcion que lleva a ver la direccion a WhatsAPP =======
    const openWpp = (type) => {
        let whatsApp;
        switch (type) {
            case 1:
                whatsApp = `https://api.whatsapp.com/send?phone=5492995319130&text=Hola!%20quisiera%20consultar%20por%20los%20cursos`;
                break

            case 2:
                whatsApp = `https://api.whatsapp.com/send?phone=5492994231570&text=Hola!%20quisiera%20consultar%20por%20los%20cursos`;
                break
            default:
                whatsApp = ''
                break
        }
        window.open(whatsApp, '_blank');
    };

    //======= Funcion que lleva a ver la direccion al Email =======
    const openEmail = (type) => {
        let email;
        switch (type) {
            case 1:
                email = `mailto:academiamanejar@hotmail.com?subject=Consulta&body=`;
                break

            case 2:
                email = `mailto:sugerencias@academiamanejar.com.ar?subject=Consulta&body=`;
                break
            default:
                email = ''
                break
        }
        window.open(email, '_blank');
    };


    const customIcon = {
        iconUrl: markerIcon,
        shadowUrl: shadowIcon,
        //iconSize: [35, 45],
        //iconAnchor: [15, 30],
        popupAnchor: [0, -40],
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    };

    const position = [-38.93870593256273, -67.980419099027179]

    return (
        <Grid container className={classes.container} alignContent='center' justifyContent="space-around">
            <Grid item>
                <Paper elevation={8} className={classes.mapaContainer} >
                    <MapContainer center={position} minZoom={13} zoom={15} style={{ height: '100%' }} scrollWheelZoom={true}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position} className={classes.iconLocation} icon={new Icon(customIcon)} >
                            <Popup>
                                <Button onClick={openGoogleMaps} color='letters'>
                                    Alem 1474, Cipolletti, Rio Negro
                                </Button>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </Paper>
            </Grid>
            <Grid item style={{ width: 600 }}>
                <Grid container direction="column" spacing={2} className={classes.containerTxt}>
                    <Grid item>
                        <Typography className={classes.txtPrimary}>
                            ¿Cómo encontrarnos?
                        </Typography>
                    </Grid>
                    <Grid item>
                        <LocationOn className={classes.icon} />
                        <Button
                            variant="outlined"
                            color="letters"
                            onClick={openGoogleMaps}
                        >
                            <Typography className={classes.txtSecondary}>
                                Alem 1474, Cipolletti, Rio Negro
                            </Typography>
                        </Button>
                    </Grid>
                    <Grid item>
                        <WhatsApp className={classes.icon} />
                        <Button
                            variant="contained"
                            color="btn"
                            onClick={() => openWpp(1)}
                            className={classes.button}
                        >
                            <Typography className={classes.txtSecondary}>
                                (+54) 9 299 5319130
                            </Typography>
                        </Button>
                    </Grid>
                    <Grid item>
                        <WhatsApp className={classes.icon} />
                        <Button
                            variant="contained"
                            color="btn"
                            onClick={() => openWpp(2)}
                            className={classes.button}
                        >
                            <Typography className={classes.txtSecondary}>
                                (+54) 9 299 4231570
                            </Typography>
                        </Button>
                    </Grid>
                    <Grid item>
                        <Email className={classes.icon} />
                        <Button
                            variant="text"
                            color="letters"
                            onClick={() => openEmail(1)}
                        >
                            <Typography className={classes.txtSecondary}>
                                academiamanejar@hotmail.com
                            </Typography>
                        </Button>
                    </Grid>
                    <Grid item>
                        <Email className={classes.icon} />
                        <Button
                            variant="text"
                            color="letters"
                            onClick={() => openEmail(2)}
                        >
                            <Typography className={classes.txtSecondary}>
                                sugerencias@academiamanejar.com.ar
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid >
    )
}

export default HowToFindV