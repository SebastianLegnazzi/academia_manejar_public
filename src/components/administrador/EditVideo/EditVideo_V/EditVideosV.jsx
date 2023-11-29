import React, { useContext, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import {
    Grid,
    IconButton,
    Skeleton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    TextField,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import EstructuraV from '../../../estructura/EstructuraV';
import { HomeContext } from '../../../Providers/HomeContext';
import EditVideosC from '../EditVideo_C/EditVideosC';
import { Clear, Edit, ToggleOff, ToggleOn } from '@mui/icons-material';

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
        marginBottom: '100px',
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
    txtDialogHeader: {
        color: 'black',
        fontWeight: 700,
        lineHeight: '1.5',

        marginLeft: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
            marginLeft: theme.spacing(0),
        },
    },
    btnReg: {
        marginBottom: theme.spacing(2),
        background: theme.palette.letters.main,
        color: 'white',
        '&:hover': {
            background: theme.palette.btn.hover,
            color: 'white'
        },
    },
    btnActiv: {
        color: theme.palette.primary.main,
        fontSize: '30px',
    },
    btnInact: {
        color: 'red',
        fontSize: '30px',
    },
}));

const controllerEditVideos = new EditVideosC();

const EditVideosV = () => {

    const { setAlert } = useContext(HomeContext);

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //======= USESTATE =======
    const [openCard, setOpenCard] = useState(false);
    const [data, setData] = useState([]);
    const [videoAll, setVideoAll] = useState(false);

    useEffect(() => {
        setVideoAll(null)
        controllerEditVideos.getAllVideo()
            .then((resp) => {
                if (resp.ok) {
                    setVideoAll(resp.data)
                } else {
                    console.log(resp)
                }
            }).catch((error) => {
                console.log(error)
            });
    }, [])

    const handleActivated = (item) => {
        setAlert({ message: 'Activando video...', type: 'info', status: true })
        controllerEditVideos.activated(item)
            .then((resp) => {
                if (resp.ok) {
                    setAlert({ message: 'Video activado correctamente!', type: 'success', status: true })
                    setVideoAll(resp.data)
                } else {
                    console.log(resp)
                }
            })
            .catch((error) => {
                setAlert({ message: 'Error al activar video', type: 'error', status: true })
                console.log(error)
            });
    }

    //Funcion que abre el modal
    const handleOpenCard = (item = "") => {
        if (item !== "" && item.altKey === undefined) {
            setData(item);
        } else {
            setData({ name: '', description: '' })
        }
        setOpenCard(!openCard);
    };

    const handleDeleteItem = (item) => {
        setAlert({ message: 'Desactivando video...', type: 'info', status: true })
        controllerEditVideos.delete(item)
            .then((resp) => {
                if (resp.ok) {
                    setAlert({ message: 'Video desactivado correctamente!', type: 'success', status: true })
                    setVideoAll(resp.data)
                } else {
                    console.log(resp)
                }
            })
            .catch((error) => {
                setAlert({ message: 'Error al eliminar video', type: 'error', status: true })
                console.log(error)
            });
    }

    //Funcion que guarda los cambios
    const saveChanges = () => {
        setAlert({ message: 'Guardando cambios...', type: 'info', status: true })          //Muestro el alert
        controllerEditVideos.edit(data)                                //Llamo al controlador para editar el curso
            .then((resp) => {
                handleOpenCard();
                if (resp.ok) {
                    setAlert({ message: resp.message, type: 'success', status: true })
                    setOpenCard(false);
                    setVideoAll(resp.data)
                } else {
                    setAlert({ message: resp.message, type: 'error', status: true })
                    console.log(resp)
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }


    //======= VISTA =======
    return (
        <EstructuraV
            render={() => (
                <Grid item container id='login' className={classes.container}>

                    {/* MODAL EDICION CURSO */}
                    {data &&
                        <Dialog
                            open={openCard}
                            onClose={handleOpenCard}
                            aria-labelledby="Esperando"
                            aria-describedby="Esprando a cargar la pagina"
                        >
                            <DialogTitle id="alert-dialog-title" align="center">
                                <Grid container spacing={2}>
                                    <Grid item container justifyContent='center' xs={12}>
                                        <Grid item xs={10} md={11}>
                                            <Typography variant="h6" className={classes.txtDialogHeader}>
                                                Editar video {data.id}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <IconButton onClick={handleOpenCard}>
                                                <Clear color='letters' />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </DialogTitle>
                            <DialogContent>
                                {data &&
                                    <Grid container spacing={2} alignItems="center" justifyContent='center'>
                                        <Grid item xs={12} lg={6}>
                                            <TextField
                                                id="titulo"
                                                color="letters"
                                                label="Titulo del video"
                                                variant="filled"
                                                fullWidth
                                                value={data.title}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        saveChanges()
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setData({ ...data, title: e.target.value })

                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6}>
                                            <TextField
                                                id="urlvideo"
                                                color="letters"
                                                label="URL del video"
                                                variant="filled"
                                                fullWidth
                                                value={data.urlvideo}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        saveChanges()
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setData({ ...data, urlvideo: e.target.value })
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} align='center'>
                                            <Button
                                                variant='contained'
                                                className={classes.btnReg}
                                                onClick={() => saveChanges()}
                                            >
                                                Guardar cambios
                                            </Button>
                                        </Grid>
                                    </Grid>
                                }
                            </DialogContent>
                        </Dialog>
                    }

                    {videoAll ? (
                        <Grid item container spacing={1} justifyContent='space-around'>
                            {videoAll.map((item, index) => (
                                <Grid key={index} item container justifyContent='center'>
                                    <Grid item className={classes.containerVid}>
                                        <Grid item container className={classes.txtVideo}>
                                            <Grid item container justifyContent='center' xs={12} md={2}>
                                                <Grid item>
                                                    <IconButton onClick={() => handleOpenCard(item)}>
                                                        <Edit color='primary' />
                                                    </IconButton>
                                                </Grid>
                                                {item.deleted_at ? (
                                                    <Grid item>
                                                        <IconButton onClick={() => handleActivated(item)}>
                                                            <ToggleOff className={classes.btnInact}/>
                                                        </IconButton>
                                                    </Grid>
                                                ) : (
                                                    <Grid item>
                                                        <IconButton onClick={() => handleDeleteItem(item)}>
                                                            <ToggleOn className={classes.btnActiv} />
                                                        </IconButton>
                                                    </Grid>
                                                )
                                                }
                                            </Grid>
                                            <Grid item xs={12} md={9}>
                                                <Typography variant='h6'>
                                                    {item.title}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <ReactPlayer
                                            url={item.urlvideo}
                                            width="100%"
                                            height="100%"
                                            controls
                                        />
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Grid item container spacing={3} direction='column' justifyContent="center" alignContent='center' align="center">
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

                </Grid>
            )}
        />

    )
}

export default EditVideosV 