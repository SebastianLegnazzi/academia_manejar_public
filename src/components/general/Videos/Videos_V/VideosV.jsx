import React, { useContext, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Grid, Skeleton, Typography, } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import EstructuraV from '../../../estructura/EstructuraV';
import { HomeContext } from '../../../Providers/HomeContext';
import VideosC from '../Videos_C/EditVideosC';

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        backgroundColor: theme.palette.primary.main,
    },
    containerVid: {
        width: '70%',
        height: '600px',
        marginTop: '30px',
        marginBottom: '50px',
        boxShadow: '-8px 40px 30px 2px rgba(0,0,0,0.55)',
        [theme.breakpoints.down('md')]: {
            width: '95%',
            height: '500px',
        },
        [theme.breakpoints.down('sm')]: {
            width: '95%',
            height: '300px',
        },
    },
    txtVideo: {
        textAlign: 'center',
        backgroundColor: theme.palette.letters.main,
        color: 'white',
    },
    txtNonVideo: {
        padding: '20px',
        borderRadius: '40px',
        textAlign: 'center',
        backgroundColor: theme.palette.letters.main,
        color: 'white',
    },
    skeleton: {
        width: 1000,
        height: 300,
        [theme.breakpoints.down('lg')]: {
            width: 800,
            height: 300,
        },
        [theme.breakpoints.down('md')]: {
            width: 500,
            height: 300,
        },
        [theme.breakpoints.down('sm')]: {
            width: 350,
            height: 300,
        },
    },
}));

const controllerVideoC = new VideosC();

const VideosV = () => {

    const { video, setVideo } = useContext(HomeContext);

    // useEffect(() => {
    //     controllerVideoC.getVideo()
    //         .then((data) => {
    //             if (data.ok) {
    //                 setVideo(data.data);
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }, [setVideo]);

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();
    //======= VISTA =======
    return (
        <EstructuraV
            render={() => (
                <Grid item container id='login' className={classes.container}>
                    {video ? (
                        video.length > 0 ? (
                            <Grid item container spacing={1} justifyContent='space-around'>
                                {video.map((item, index) => (
                                    <Grid key={index} item container justifyContent='center'>
                                        <Grid item className={classes.containerVid}>
                                            <Typography variant='h6' className={classes.txtVideo}>
                                                {item.description}
                                            </Typography>
                                            <ReactPlayer
                                                url={item.url}
                                                width="100%"
                                                height="100%"
                                                controls
                                                className={classes.video}
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Grid item container justifyContent='center' alignContent='center'>
                                <Typography variant='h6' className={classes.txtNonVideo}>
                                    No hay videos cargados
                                </Typography>
                            </Grid>
                        )
                    ) : (
                        <Grid item container spacing={1} direction='column' justifyContent="center" alignContent='center' align="center">
                            <Grid item>
                                <Skeleton variant="rectangular" animation="wave" className={classes.skeleton} />
                            </Grid>
                            <Grid item>
                                <Skeleton variant="rectangular" animation="wave" className={classes.skeleton} />
                            </Grid>
                            <Grid item>
                                <Skeleton variant="rectangular" animation="wave" className={classes.skeleton} />
                            </Grid>
                        </Grid>
                    )
                    }

                </Grid >
            )}
        />

    )
}

export default VideosV 