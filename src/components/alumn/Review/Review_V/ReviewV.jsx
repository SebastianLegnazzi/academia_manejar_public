import React, { useContext, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import EstructuraV from '../../../estructura/EstructuraV';
import { UserContext } from '../../../Providers/UserContext';
import { Button, Divider, Grid, Paper, Rating, TextareaAutosize, Typography } from '@mui/material';
import Loading from '../../../estructura/Loading';
import ReviewC from '../Review_C/ReviewC';
import dayjs from 'dayjs';
import { HomeContext } from '../../../Providers/HomeContext';

//============== COMPONENTES ==============

const useStyles = makeStyles((theme) => ({
    container: {
        padding: '10px 5px',
    },
    paper: {
        width: 500,
        [theme.breakpoints.down('sm')]: {
            width: 300,
        },

        padding: '20px',


        boxShadow: theme.palette.shadows.color2, // Ajusta los valores para lograr el efecto deseado

    },
    buttonEnv: {
        marginTop: '10px',
        backgroundColor: theme.palette.btn.color3,
        '&:hover': {
            backgroundColor: theme.palette.btn.color3H,
        },

        color: 'black',
    },
    reviewFind: {
        fontSize: '11px',
        marginBottom: '5px',
        letterSpacing: '1px',
        fontWeight: 'bold',
    }
}));

const controllerReview = new ReviewC();

const ReviewV = () => {

    //======= USE STATES =======
    const [pendingReviews, setPendingReviews] = useState(null);
    const [courseRating, setCourseRating] = useState(2);
    const [comment, setComment] = useState('');
    const [textLoading, setTextLoading] = useState('Buscando Turnos sin Reseñas');

    //======= USE CONTEXT =======
    const { user } = useContext(UserContext);
    const {
        setAlert,
    } = useContext(HomeContext);

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    useEffect(() => {
        if ((!pendingReviews)) {
            controllerReview.getPendingReviews({ idUser: user.id })
                .then((data) => {
                    if (data.ok) {
                        console.log(data.data)
                        setAlert({ message: data.message, type: 'success', status: true });
                        setPendingReviews(data.data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [pendingReviews])

    const handleRatingChange = (event, newRating) => {
        setCourseRating(newRating);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const saveReview = () => {
        setPendingReviews(null);
        setTextLoading('Estamos Actualizando lo datos')
        controllerReview.saveReview({ score: courseRating ?? 0, comment: comment, turn_id: pendingReviews[0].id })
            .then((data) => {
                if (data.ok) {
                    console.log(data.data)
                    setPendingReviews(null);
                    setComment('');
                    setTextLoading('Buscando más turnos sin tu opinión:(');
                    
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //======= VISTA =======
    return (
        <EstructuraV
            render={() => (
                <Grid container spacing={1} justifyContent='space-evenly' className={classes.container} marginBottom={5}>
                    <Grid item xs={12}>
                        <Typography variant='h4' component='div' align='center'>
                            Reseñas
                        </Typography>
                    </Grid>
                    {pendingReviews ? (
                        <>
                            {/* <Grid item align='center' xs={12}>
                                <Button onClick={() => setPendingReviews(null)} variant='h4' component='div' align='center'>
                                    Actualizar <Refresh />
                                </Button>
                            </Grid> */}
                            {pendingReviews.length > 0 ? (
                                <Grid item>
                                    <Grid textAlign='center'>
                                        <Typography variant="subtitle1" className={classes.reviewFind}>{pendingReviews.length} RESEÑA/s ENCONTRADA</Typography>
                                    </Grid>
                                    <Paper className={classes.paper}>
                                        <Grid>
                                            <Typography variant="h5" textAlign='center'>Detalles del Turno</Typography>
                                        </Grid>
                                        <Grid padding={1}>
                                            <Typography variant="subtitle1"><span >Instructor:</span> {pendingReviews[0].instruct_timestamp.user_instruct.name} {pendingReviews[0].instruct_timestamp.user_instruct.lastname}</Typography>
                                        </Grid>
                                        <Divider></Divider>
                                        <Grid padding={1}>
                                            <Typography variant="subtitle1">Desde: {dayjs(pendingReviews[0].date_turn_ini).format('DD-MM-YY')} Hasta: {dayjs(pendingReviews[0].date_turn_end).format('DD-MM-YY')}</Typography>
                                        </Grid>
                                        <Divider></Divider>
                                        <Grid padding={1}>
                                            <Typography variant="subtitle1">Curso: {pendingReviews[0].course.title}</Typography>
                                        </Grid>
                                        <Divider></Divider>
                                        <Grid padding={1}>
                                            <Typography variant="subtitle1">¿Qué tan bueno te resultó nuestro servicio?</Typography>

                                            <Rating

                                                name="course-rating"
                                                value={courseRating}
                                                precision={1}
                                                max={5}
                                                min={0}
                                                onChange={handleRatingChange}
                                            />
                                        </Grid>
                                        <Divider></Divider>
                                        <Grid padding={1}>
                                            <Typography variant="subtitle1">Dejanos un comentario si lo deseas, esto nos ayudará a mejorar :)</Typography>
                                            <TextareaAutosize
                                                aria-label="campo de texto"
                                                placeholder="Tu comentario..."
                                                minRows={3}
                                                value={comment}
                                                onChange={handleCommentChange}
                                                style={{ width: '100%', maxWidth: '100%', maxHeight: '200px' }}
                                            />
                                        </Grid>
                                        <Divider></Divider>
                                        <Grid container justifyContent='end'>
                                            <Button onClick={saveReview} className={classes.buttonEnv}>
                                                Enviar
                                            </Button>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            ) : (
                                <Grid>
                                    <Typography> No se encontró alguna reseña pendiente </Typography>
                                </Grid>
                            )
                            }
                        </>
                    ) : (
                        <Grid>
                            <Paper>
                                <Loading text={textLoading} />
                            </Paper>
                        </Grid>
                    )
                    }
                </Grid>
            )}
        />
    )
}

export default ReviewV
