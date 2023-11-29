import { Button, Grid, Typography, } from '@mui/material'
import React, { memo } from 'react'
import makeStyles from '@mui/styles/makeStyles';
import ExamC from '../Exam_C/ExamC';
import { useNavigate } from 'react-router-dom';
import { CheckOutlined, CloseOutlined } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
    tituloRes: {
        fontSize: '2rem',
        fontWeight: 'bold',
    },
    containerResum: {
        width: '50%',
        backgroundColor: theme.palette.background.color8,
        borderRadius: '1rem',
        padding: '1rem',
        marginBottom: '1rem',
        [theme.breakpoints.down('md')]: {
            width: '98%',
        },
    },
    txtResum: {
        fontSize: '1.2rem',
        [theme.breakpoints.down('md')]: {
            fontSize: '1rem',
        },
    },
    tituloPreg: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        [theme.breakpoints.down('md')]: {
            fontSize: '1.2rem',
        },
    },
    containerPreg: {
        width: '60%',
        backgroundColor: theme.palette.background.color8,
        borderRadius: '1rem',
        padding: '1rem',
        marginBottom: '1rem',
        [theme.breakpoints.down('lg')]: {
            width: '80%',
        },
        [theme.breakpoints.down('md')]: {
            width: '98%',
        },
    },
    txtPreg: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        [theme.breakpoints.down('md')]: {
            fontSize: '1rem',
        },
    },
    imgPreg: {
        width: '500px',
        height: '300px',
        [theme.breakpoints.down('md')]: {
            width: '330px',
            height: '250px',
        },
        marginBottom: '1rem',
    },
    txtResp: {
        fontSize: '1rem',
        fontWeight: 'bold',
        [theme.breakpoints.down('md')]: {
            fontSize: '0.8rem',
        },
    },
    txtRespCorrect: {
        fontSize: '1rem',
        fontWeight: 'bold',
        backgroundColor: theme.palette.letters.color7,
        borderRadius: '0.5rem',
        padding: '0.5rem',
        marginBottom: '1rem',
        [theme.breakpoints.down('md')]: {
            fontSize: '0.8rem',
        },
    },
    txtRespInc: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: theme.palette.letters.color8,
        borderRadius: '0.5rem',
        padding: '0.5rem',
        marginBottom: '1rem',
        [theme.breakpoints.down('md')]: {
            fontSize: '0.8rem',
        },
    },
    txtApro: {
        fontSize: '2rem',
        fontWeight: 'bold',
        background: theme.palette.letters.color7,
        borderRadius: '50px',
        [theme.breakpoints.down('md')]: {
            fontSize: '1.5rem',
        },
    },
    txtDesap: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'white',
        background: theme.palette.letters.color8,
        borderRadius: '50px',
        [theme.breakpoints.down('md')]: {
            fontSize: '1.5rem',
        },
    },
    iconApro: {
        color: '#00c200',
    },
    iconDesa: {
        color: '#cc0c00',
    },
    btnVolver: {
        background: theme.palette.letters.color2,
        borderRadius: '50px',
        padding: '10px 20px',
        marginBottom: '10px',
    }
}));


const ResultExamV = memo(({ data }) => {
    //======= VARIABLE ESTILOS =======
    const classes = useStyles();
    const navigate = useNavigate();

    console.log(data)

    return (
        data &&
        <Grid container justifyContent='center' direction='column' alignItems='center' className={classes.container}>
            <Grid item align='center'>
                <Typography className={classes.tituloRes}>Resumen del examen</Typography>
            </Grid>
            <Grid item container direction='column' alignContent='center' className={classes.containerResum}>
                <Grid item className={data.result.approved ? classes.txtApro : classes.txtDesap} align='center'>
                    {data.result.approved ? 'Aprobado' : 'Desaprobado'}
                </Grid>
                <Grid item className={classes.txtResum}>
                    <strong>Preguntas respondidas correctamente:</strong> {data.result.correctas}
                </Grid>
                <Grid item className={classes.txtResum}>
                    <strong>Preguntas respondidas incorrectamente:</strong> {data.result.incorrectas}
                </Grid>
                <Grid item className={classes.txtResum}>
                    <strong>Promedio del examen:</strong> {data.result.promedio}%
                </Grid>
                <Grid item className={classes.txtResum}>
                    <strong>Tiempo:</strong> {
                        data.result.time > 60 ?
                            `${Math.floor(data.result.time / 60)} minutos y ${data.result.time % 60} segundos` :
                            `${data.result.time} segundos`}
                </Grid>
            </Grid>
            <Grid item>
                <Button
                    className={classes.btnVolver}
                    onClick={() => {
                        navigate('/exam')
                    }}
                    variant='contained'
                >Volver</Button>
            </Grid>
            <Grid item className={classes.tituloPreg}>
                Preguntas
            </Grid>
            <Grid item container justifyContent='center'>
                {data.exam.map((pregunta, index) => {
                    return (
                        <Grid container direction='column' key={index} className={classes.containerPreg}>
                            <Grid item spacing={1} container justifyContent='center' className={classes.txtPreg}>
                                <Grid item>
                                    {data.respExam[pregunta.id].correct ? <CheckOutlined className={classes.iconApro} /> : <CloseOutlined className={classes.iconDesa} />}
                                </Grid>
                                <Grid item>
                                    {pregunta.title}
                                </Grid>
                            </Grid>
                            <Grid item align='center'>
                                {pregunta.img &&
                                    <img className={classes.imgPreg} src={pregunta.img} alt="imagen resumen" />
                                }
                            </Grid>
                            {data.respExam[pregunta.id].correct ? (
                                <Grid item key={index} className={classes.txtRespCorrect}>
                                    {data.respExam[pregunta.id].text}
                                </Grid>
                            ) : (
                                <Grid item>
                                    <Grid item className={classes.txtRespInc}>
                                        {data.respExam[pregunta.id].text}
                                    </Grid>
                                    <Grid item>
                                        {pregunta.answers.map((answer, index) => {
                                            if (answer.correct) {
                                                return (
                                                    <Grid item key={index} className={classes.txtRespCorrect}>
                                                        {answer.text}
                                                    </Grid>
                                                )
                                            }
                                        })}
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                    )
                })}
            </Grid>
            <Grid item>
                <Button
                    className={classes.btnVolver}
                    onClick={() => {
                        navigate('/exam')
                    }}
                    variant='contained'
                >Volver</Button>
            </Grid>
        </Grid>
    )
})

export default ResultExamV