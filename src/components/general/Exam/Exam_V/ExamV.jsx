import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import EstructuraV from '../../../estructura/EstructuraV'
import makeStyles from '@mui/styles/makeStyles';
import { ExamContext } from '../../../Providers/ExamContext';
import ExamC from '../Exam_C/ExamC';
import { useNavigate } from 'react-router-dom';
import { HomeContext } from '../../../Providers/HomeContext';
import { UserContext } from '../../../Providers/UserContext';
import ResultExamV from './ResultExamV';
import Loading from '../../../estructura/Loading';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        padding: '20px 0px',
    },
    containerExam: {
        position: 'relative',
        background: theme.palette.background.color7,
        borderRadius: '50px',
        minWidth: '400px',
        maxWidth: '700px',
        padding: '5px 20px',
        [theme.breakpoints.down('md')]: {
            minWidth: '350px',
            padding: '5px 3px',
        },
    },
    headerExam: {
    },
    btnSig: {
        padding: '10px 30px',
        borderRadius: '30px',
        marginRight: theme.spacing(2),
    },
    titleGeneral: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        color: theme.palette.primary.main,
        [theme.breakpoints.down('md')]: {
            fontSize: '1.5rem',
        },
    },
    titleExam: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: '10px 0px',
        color: theme.palette.letters.main,
        [theme.breakpoints.down('md')]: {
            fontSize: '0.9rem',
        },
    },
    labelRadio: {
        fontSize: '0.9rem',
        [theme.breakpoints.down('md')]: {
            fontSize: '0.8rem',
        }
    },
    img: {
        width: '100%',
        height: 'auto',
        maxWidth: '500px',
        maxHeight: '500px',
        [theme.breakpoints.down('md')]: {
            maxWidth: '250px',
            maxHeight: '250px',
        },
    },
    radio: {
        marginBottom: '10px',
        [theme.breakpoints.down('md')]: {
            marginBottom: '5px',
        }
    },
    time: {
        position: 'absolute',
        top: '13px',
        right: '35px',
        color: theme.palette.letters.color2,
        [theme.breakpoints.down('sm')]: {
            right: '20px',
        }
    }
}));


//controlador para el examen
const controlExam = new ExamC();

const ExamV = () => {
    //======= VARIABLE ESTILOS =======
    const classes = useStyles();
    const { param } = useContext(ExamContext);
    const { user } = useContext(UserContext);
    const { setAlert } = useContext(HomeContext);

    const [exam, setExam] = useState(null);
    const [openMResult, setOpenMResult] = useState(false);
    const [answer, setAnswer] = useState(null);
    const [pregunta, setPregunta] = useState(null);
    const [numPregunta, setNumPregunta] = useState(null);
    const [respExam, setRespExam] = useState([]);
    const [resultExam, setResultExam] = useState(null);
    const [openMConfResult, setOpenMConfResult] = useState(false);
    const [tiempoRestante, setTiempoRestante] = useState(param ? 60 * param.time : 0); // TIEMPO DE ESPERA PARA LA RESERVA
    const navigate = useNavigate();


    //Busco el examen con las preferencias del usuario
    useEffect(() => {
        if (exam === null) {
            if (param !== null) {
                controlExam.getExam(param)
                    .then((res) => {
                        //Recorro las preguntas para parsear las respuestas a json
                        res.data.map((pregunta) => {
                            pregunta.answers = JSON.parse(pregunta.answers);
                        });
                        setExam(res.data);
                        setPregunta(res.data[0]);
                        setNumPregunta(0);
                    }).catch((err) => {
                        console.log(err);
                    })
            } else {
                navigate('/exam');
            }
        } else {
            if (pregunta && respExam[pregunta.id]) {
                setAnswer(respExam[pregunta.id].index);
            } else {
                setAnswer(null);
            }
        }
    }, [exam, pregunta, respExam]);


    //Funcion que controla el tiempo de la reserva
    useEffect(() => {
        const accionAlTerminar = () => {
            clearInterval(intervalId);
            navigate('/exam');
            setAlert({ message: 'Se ha terminado el tiempo para seguir con el examen', type: 'error', status: true })
        };
        const temporizadorId = setTimeout(accionAlTerminar, tiempoRestante * 1000);

        const intervalId = setInterval(() => {
            if (tiempoRestante > 0 && exam !== null && !openMResult) {
                // console.log('resto')
                setTiempoRestante(prevTiempo => prevTiempo - 1);
            }
        }, 1000);

        // Limpia el temporizador y el intervalo si el componente se desmonta antes de que termine
        return () => {
            clearTimeout(temporizadorId);
            clearInterval(intervalId);
        };
    }, [exam]);

    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;


    // console.log('Examen: ', exam);
    // console.log('respExam: ', respExam);
    // console.log('Answer: ',answer)
    // console.log('numPregunta: ', numPregunta)


    //Guardo las respuestas del examen
    const saveAnswer = (e) => {
        // console.log(e.target.value)
        let answerSelect = e.target.value;
        let objAnswer = pregunta.answers[answerSelect];
        let resp = respExam;
        objAnswer['index'] = answerSelect;
        resp = { ...resp, [pregunta.id]: objAnswer };
        setRespExam(resp)
        console.log(resp)
        setAnswer(answerSelect)
    }

    //Paso a la siguiente pregunta
    const nextQuestion = () => {
        if (answer !== null) {
            let num = numPregunta + 1;
            if (num < exam.length) {
                setNumPregunta(num);
                setPregunta(exam[num]);
            }
        } else {
            setAlert({
                status: true,
                type: 'info',
                message: 'Debe seleccionar una respuesta',
            });
        }
    }

    //Vuelvo a la pregunta anterior
    const lastQuestion = () => {
        console.log(numPregunta)
        if (numPregunta > 0) {
            let num = numPregunta - 1;
            setNumPregunta(num);
            setPregunta(exam[num]);
        }
    }

    //Guardo el examen
    const finishExam = () => {
        let objResultExam = {
            result: processResult(),
            userId: user ? user.id : null,
            param,
            exam,
            respExam
        };
        console.log(objResultExam)
        setResultExam(objResultExam);
        if (answer !== null) {
            // localStorage.setItem('objResultExam', JSON.stringify(objResultExam));
            if (user) {
                controlExam.finishExam(objResultExam)
                    .then((res) => {
                        console.log(res)
                    }).catch((err) => {
                        console.log(err)
                        setAlert({ status: true, type: 'error', message: 'Error al guardar el examen' })
                    })
            }
            setOpenMConfResult(false);
            setOpenMResult(true);
        } else {
            setAlert({
                status: true,
                type: 'info',
                message: 'Debe seleccionar una respuesta',
            });
        }
    }

    //Proceso los resultados
    const processResult = () => {
        let correctas = 0;
        let incorrectas = 0;
        exam.map((pregunta) => {
            if (respExam[pregunta.id]) {
                if (pregunta.answers[respExam[pregunta.id].index].correct) {
                    correctas++;
                } else {
                    incorrectas++;
                }
            }
        });
        let timeRest = param.time * 60 - tiempoRestante;
        //promedio
        let promedio = ((correctas * 100) / exam.length).toFixed(0);
        let objResult = { correctas: correctas, incorrectas: incorrectas, promedio: promedio, time: timeRest };
        if (promedio >= parseInt(param.minApproved)) {
            objResult.approved = true;
        } else {
            objResult.approved = false;
        }
        return objResult;
    }

    return (
        <EstructuraV
            render={() =>
                <Grid container justifyContent='center' className={classes.container}>

                    {/* MODAL PAGINA */}
                    <Dialog
                        open={openMConfResult}
                        onClose={() => setOpenMConfResult(false)}
                        aria-labelledby="alert-auth"
                        aria-describedby="alert-auth"
                    >
                        <DialogTitle id="alert-auth-title" align="center" className={classes.txtTitleDialog}>
                            Esta seguro de finalizar el examen?
                        </DialogTitle>
                        <DialogContent>
                            <Grid container alignItems="center" justifyContent='center' className={classes.txtDescDialog}>
                                <Grid item>
                                    Luego de finalizar vera el resultado del examen
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => setOpenMConfResult(false)}
                            >Cancelar</Button>
                            <Button
                                onClick={finishExam}
                            >Finalizar</Button>
                        </DialogActions>
                    </Dialog>


                    {exam && !openMResult ? (
                        <Grid item className={classes.containerExam}>
                            <Grid item className={classes.titleGeneral}>
                                EXAMEN - {numPregunta + 1} De {exam.length}
                            </Grid>
                            <Grid item align='end' className={classes.time}>
                                {minutos > 0 ? (
                                    minutos + ':' + (segundos < 10 ? '0' + segundos : segundos)
                                ) : (
                                    segundos + 's'
                                )
                                }
                            </Grid>
                            {pregunta !== null &&
                                <Grid item>
                                    {/* PREGUNTA */}
                                    <Grid item className={classes.titleExam}>
                                        {pregunta.title}
                                    </Grid>

                                    {/* IMAGEN */}
                                    {pregunta.img &&
                                        <Grid item align='center'>
                                            <img className={classes.img} src={pregunta.img} alt='Imagen del examen' />
                                        </Grid>
                                    }

                                    {/* RESPUESTAS */}
                                    <Grid item>
                                        <RadioGroup
                                            aria-labelledby="resp_exam"
                                            name="resp_exam_radio"
                                            value={answer}
                                        >
                                            {pregunta.answers.map((respuesta, index) => (
                                                <FormControlLabel
                                                    key={index}
                                                    value={index}
                                                    onChange={saveAnswer}
                                                    control={<Radio />}
                                                    className={classes.radio}
                                                    label={
                                                        <span className={classes.labelRadio}>{respuesta.text}</span>}
                                                />
                                            ))}
                                        </RadioGroup>

                                    </Grid>
                                </Grid>
                            }
                            <Grid item container justifyContent={pregunta && pregunta.id !== exam[0].id ? 'space-between' : 'end'}>
                                {numPregunta !== 0 &&
                                    <Button
                                        className={classes.btnSig}
                                        onClick={lastQuestion}
                                    >
                                        Atrás
                                    </Button>
                                }
                                {numPregunta + 1 !== exam.length ? (
                                    <Button
                                        className={classes.btnSig}
                                        onClick={nextQuestion}
                                    >
                                        Siguente
                                    </Button>
                                ) : (
                                    <Button
                                        className={classes.btnSig}
                                        onClick={() => setOpenMConfResult(true)}
                                    >
                                        Finalizar
                                    </Button>
                                )
                                }
                            </Grid>
                        </Grid>
                    ) : !openMResult ? (
                        <Loading text='Preparando examen...'/>
                    ) : (
                        <ResultExamV data = { resultExam } />
                    )}
                </Grid>
            }
        />)
}

export default ExamV