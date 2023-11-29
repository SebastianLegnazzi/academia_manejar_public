import React, { useEffect, useState, useRef, useContext } from 'react';
import {
    Grid,
    Skeleton,
    Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Flickity from 'react-flickity-component';
import "flickity/css/flickity.css";
import { HomeContext } from '../../../Providers/HomeContext';

const {
    REACT_APP_URL_STORAGE,
} = process.env;

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
    container: {
        background: theme.background.style2,
    },
    img: {
        height: '250px',
        width: '250px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '1px solid rgba(0,0,0,0.30)',
        overflow: 'hidden',
        boxShadow: '0px 3px 15px 0px rgba(0,0,0,0.40)',
        transition: 'transform 0.4s',
    },
    activeImg: {
        transform: 'scale(1.3)',
        boxShadow: '0px 5px 20px 3px rgba(0,0,0,0.70)',
        [theme.breakpoints.down('md')]: {
            transform: 'scale(1.2)',
        },
    },
    activeTxt: {
        transform: 'scale(1.2)',
        boxShadow: '#131275',
        [theme.breakpoints.down('md')]: {
            transform: 'scale(1.2)',
        },
    },
    fullname: {
        fontSize: '25px',
        fontWeight: 'bold',
        color:theme.palette.letters.color4,
        textTransform: 'capitalize',
        [theme.breakpoints.down('md')]: {
            fontSize: '15px',
        },

    },
    rol: {
        fontSize: '20px',
        color: theme.palette.letters.color4,
        fontStyle: 'italic',
        textTransform: 'capitalize',
        [theme.breakpoints.down('md')]: {
            fontSize: '15px',
        },
    },
    containerImg: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '50px',
    },
    dataContainer: {
        marginTop: '20px',
        backgroundColor: theme.palette.background.color2,
        borderRadius: '10px',
        padding: '2px 12px 2px 12px',
        marginLeft: theme.spacing(1),
        fontSize: '14px',
        boxShadow: theme.palette.shadows.color1,
        transition: 'transform 0.4s',
    },
    containerSkeleton: {
        padding: '20px',
    },
    skeleton: {
        width: 250,
        height: 250,
    },
    containerImgLogo: {
        marginTop: '20px',
        paddingRight: '20px',
    },
    imgLogo: {
        width: '150px',
        height: '40px',
    }
}));

//======= OPCIONES CARROUSEL (flikity) =======
const flickityOptions = {
    initialIndex: 1,
    wrapAround: false,
    pageDots: false,
    selectedAttraction: 0.01,
    friction: 0.15,
    autoPlay: 6000,
};

const UsV = () => {

    //======= USE CONTEXT =======
    const { us } = useContext(HomeContext);

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //======= USE STATE =======
    const [flikity, setFlikity] = useState(null);

    //===== USE REF ======
    const imgsRef = useRef([]);

    useEffect(() => {
        //===== EVENTO CARROUSEL ======
        if (flikity) {
            flikity.on('change', () => {
                const activeIndex = flikity.selectedIndex;
                imgsRef.current.forEach((img, index) => {
                    if (img !== null) {
                        img.classList.toggle(classes.activeImg, index === activeIndex);
                        img.nextElementSibling.classList.toggle(classes.activeTxt, index === activeIndex);
                    }
                });
            });
        }
    }, [flikity, classes.activeImg, classes.activeTxt]);

    return (
        <Grid className={classes.container} id='us'>
            <Grid item container direction='column' align="center">
                {/* <Grid item  xs={1} justifyContent='end' className={classes.containerImgLogo}>
                    <img src={logoAcademia} alt="Logo academia" className={classes.imgLogo} />
                </Grid> */}
                <Grid item xs={10}>
                    <Typography variant='h2' sx={{ fontWeight: 600, fontSize: { xs: '30px', md: '60px' }, marginBottom: '0.5rem' }}>
                        NOSOTROS
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography component='p' sx={{ fontSize: { xs: '15px', md: '20px' }, fontStyle: 'italic' }}>
                        Un equipo altamente capacitado para acompañarte en tu proceso de aprendizaje
                    </Typography>
                </Grid>
            </Grid>
            <Grid>
                {us ? (
                    <Flickity
                        elementType={'div'}
                        options={flickityOptions}
                        disableImagesLoaded={false}
                        reloadOnUpdate
                        static
                        flickityRef={f => setFlikity(f)}      // Guardo la instancia de flikity
                    >
                        {us.map((item, index) => (
                            <Grid key={index} item className={classes.containerImg}>
                                <img
                                    ref={ref => (imgsRef.current[index] = ref)}
                                    src={REACT_APP_URL_STORAGE + item.photoUser}
                                    className={classes.img}
                                    alt={item.description}
                                />
                                <Grid item container direction='column' alignContent='center' align='center' className={classes.dataContainer}>
                                    <Typography component='p' className={classes.fullname}>
                                        {item.fullNames}
                                    </Typography>
                                    <Typography component='p' className={classes.rol}>
                                        {item.roleNames}
                                    </Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Flickity>
                ) : (
                    <Grid container className={classes.containerSkeleton} spacing={10} justifyContent="center">
                        <Grid item>
                            <Skeleton animation="wave" variant="circular" className={classes.skeleton} />
                        </Grid>
                        <Grid item>
                            <Skeleton animation="wave" variant="circular" className={classes.skeleton} />
                        </Grid>
                        <Grid item>
                            <Skeleton animation="wave" variant="circular" className={classes.skeleton} />
                        </Grid>
                    </Grid>
                )
                }
            </Grid>
        </Grid>
    );
};

export default UsV;
