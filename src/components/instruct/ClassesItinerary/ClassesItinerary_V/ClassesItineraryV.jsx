import React, { useContext, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Paper,
    Skeleton,
    Dialog,
    DialogTitle,
    TextField,
    Button,
    Switch,
    IconButton,
    Avatar,
} from '@mui/material';
import { HomeContext } from '../../../Providers/HomeContext';
import EstructuraV from '../../../estructura/EstructuraV';
import dayjs from 'dayjs';
import ClassesItineraryC from '../ClassesItinerary_C/ClassesItineraryC';
import Loading from '../../../estructura/Loading';
import { Edit } from '@mui/icons-material';
import { UserContext } from '../../../Providers/UserContext';
const {
    REACT_APP_URL_STORAGE,
} = process.env;

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
    container: {
        padding: '30px 10px 30px 10px',
        background: theme.background.style3,
    },
    cardContainer: {
        borderRadius: '20px',
        width: '100%',
        height: '100%',
    },
    card: {
        borderRadius: '20px',
        height: '100%',
    },
    skeleton: {
        borderRadius: '20px',
        width: 300,
        height: 400,
        [theme.breakpoints.down('md')]: {
            width: 250,
            height: 300,
        },
    },
    txtDialogHeader: {
        color: theme.palette.letters.color5,
    },
    btnCancel: {
        background: 'red',
        color: 'white',
        '&:hover': {
            background: '#660500',
            color: 'white'
        },
    },
    txtDialogHeaderDelete: {
        padding: '0 !important',
        color: theme.palette.letters.color5,
        fontWeight: 700,
        fontSize: '20px',
        lineHeight: '1.5',
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
            marginLeft: theme.spacing(0),
        },
    },
    subtitle: {
        fontSize: '13px',
        textAlign: 'start',
        fontWeight: 600,
    },
    titlesub: {
        fontSize: '20px',
        textAlign: 'start !important',
    },
    inputDialog: {
        width: '100%',
        marginBottom: 5,
    },
    modal: {
        width: '70% !important',
    }
}));

const classesItineraryC = new ClassesItineraryC();

const ClassesItineraryV = () => {
    //======= USE STATE =======
    const [openCard, setOpenCard] = useState(false);
    const [itinerary, setItinerary] = useState(null);
    const [editIndex, setEditIndex] = useState(null);

    //======= USE CONTEXT =======
    const {
        setAlert,
        setOpenModal,
    } = useContext(HomeContext);

    const {user} = useContext(UserContext); 

    useEffect(() => {
        if ((!itinerary)) {
            classesItineraryC.getClassesForDate({ date: dayjs().format('YYYY-MM-DD'), instructId: user.id })
                .then((data) => {
                    if (data.ok) {
                        console.log(data.data)
                        setItinerary(data.data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [itinerary])

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    const handleSwitchChange = async (index) => {
        try {
            const updatedItinerary = [...itinerary];
            updatedItinerary[index].assistance = !updatedItinerary[index].assistance;
            setItinerary(updatedItinerary);
            setOpenModal({ title: 'Guardando cambios...', message: 'Estamos actualizando los datos', open: true, loading: true })

            // Realizar la petición para actualizar la asistencia
            const response = await classesItineraryC.setAssis({ classId: itinerary[index].id, assistance: updatedItinerary[index].assistance });
            if (response.ok) {
                setAlert({ message: response.message, type: 'success', status: true });
                setOpenModal({ open: false })
            } else {
                setAlert({ message: response.message, type: 'error', status: true });
                updatedItinerary[index].assistance = !updatedItinerary[index].assistance;
                setItinerary(updatedItinerary);
                setOpenModal({ open: false })
            }
        } catch (error) {
            console.log(error);
            setAlert({ message: "Hubo un error al guardar los cambios", type: 'error', status: true });
        }
    };

    const handleEditIndex = (index) => {
        setEditIndex(index);
    }

    const handleChangeObservation = (index) => (event) => {
        const updatedItinerary = [...itinerary];
        updatedItinerary[index].observation = event.target.value;
        setItinerary(updatedItinerary);
        if (editIndex !== index) {
            handleEditIndex(index);
        }
    };

    //Funcion que guarda los cambios
    const saveObservation = async (index) => {
        setOpenModal({ title: 'Guardando cambios...', message: 'Estamos actualizando los datos', open: true, loading: true }) //Muestro el alert
        try {

            console.log(itinerary[index])
            // Realizar la petición para actualizar la asistencia
            const response = await classesItineraryC.setObservation({ classId: itinerary[index].id, observation: itinerary[index].observation });
            if (response.ok) {
                setAlert({ message: response.message, type: 'success', status: true });
                setOpenModal({ open: false })
            } else {
                setOpenModal({ open: false })
                setAlert({ message: response.message, type: 'error', status: true });
            }
        } catch (error) {
            console.log(error);
            setAlert({ message: "Hubo un error al guardar los cambios", type: 'error', status: true });
        }
        setOpenCard(false);
    }

    //======= VISTA =======
    return (
        <EstructuraV
            render={() => (
                <Grid item container className={classes.container} id='curses' align="center" alignContent="center">
                    <Grid component='h1' justifyContent='center' container item> ITINARARIO DE HOY </Grid>
                    {/* Modal de guardando cambios */}
                    <Dialog
                        open={openCard}
                    // onClose={handleOpenDialog}
                    >
                        <DialogTitle align="center">
                            <Grid container justifyContent='center'>
                                <Typography> Guardando cambios </Typography>
                                <Loading />
                            </Grid>
                        </DialogTitle>
                    </Dialog>
                    <Grid item container justifyContent="center" className={classes.containerCards}>
                        {itinerary ? (
                            itinerary.map((item, index) => (
                                <Grid item key={index} xs={8} sm={7} md={5} lg={3} margin={3}>
                                    <Paper className={classes.cardContainer} elevation={12}>
                                        <Card className={classes.card} >
                                            <CardContent>
                                                <Grid container direction='column' spacing={1}>
                                                    <Grid item>
                                                        <Typography className={classes.subtitle}>
                                                            Horario
                                                        </Typography>
                                                        <Typography className={classes.titlesub} marginBottom={1}>
                                                            {dayjs(item.date).format("HH:mm")} - {dayjs(item.date).add(30, 'minute').format("HH:mm")}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item component='h3' marginBottom={1}>
                                                        <Typography className={classes.subtitle}>
                                                            Alumno
                                                        </Typography>
                                                        <Grid item container alignItems='center'>
                                                            <Typography className={classes.titlesub} >
                                                                {item.turns.user_alumn.name} {item.turns.user_alumn.lastname}
                                                            </Typography>
                                                            <Grid marginLeft={2}>
                                                                <Avatar
                                                                    size="60"
                                                                    src={item.turns.user_alumn.url_data ? REACT_APP_URL_STORAGE + item.turns.user_alumn.url_data.url : null}
                                                                    alt="foto del alumno"
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid container direction='column' spacing={1}>
                                                    <Grid item>
                                                        <Typography className={classes.subtitle}>
                                                            Asistencia
                                                            <Switch
                                                                checked={Boolean(item.assistance ?? false)}
                                                                onChange={() => handleSwitchChange(index)}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                            />
                                                        </Typography>
                                                    </Grid>
                                                    <Grid container alignItems="center" justifyContent='space-between' marginTop={2}>
                                                        <Grid item width='80%'>
                                                            <TextField
                                                                className={classes.inputDialog}
                                                                label="Observación"
                                                                variant="outlined"
                                                                value={item.observation || ''}
                                                                disabled={Boolean(item.observation ? (editIndex !== index || !item.observation) : item.observation)}
                                                                onChange={handleChangeObservation(index)}
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            {item.observation && (
                                                                <IconButton onClick={() => handleEditIndex(index)}>
                                                                    <Edit color='letters' className={classes.btnEdit} />
                                                                </IconButton>
                                                            )}
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item container justifyContent='end'>
                                                        <Grid item>
                                                            <Button
                                                                variant='contained'
                                                                className={classes.btnAcept}
                                                                size='small'
                                                                onClick={() => saveObservation(index)}
                                                            >
                                                                Guardar Observación
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Paper>
                                </Grid>
                            ))
                        ) : (
                            <Grid item container spacing={10} justifyContent="center" align="center">
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

                        {itinerary && (itinerary.length <= 0) ? (
                            <Grid>
                                <Typography>No se encontró alguna clase para hoy</Typography>
                            </Grid>
                        ) : null}
                    </Grid >
                </Grid >
            )}
        />
    )
}

export default ClassesItineraryV 