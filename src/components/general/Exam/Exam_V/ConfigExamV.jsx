import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material'
import React, { useContext, useState, useEffect } from 'react'
import EstructuraV from '../../../estructura/EstructuraV'
import makeStyles from '@mui/styles/makeStyles';
import { ExamContext } from '../../../Providers/ExamContext';
import { useNavigate } from 'react-router-dom';
import { HomeContext } from '../../../Providers/HomeContext';
import { useFormik } from 'formik';
import ExamC from '../Exam_C/ExamC';
import Loading from '../../../estructura/Loading';
import { UserContext } from '../../../Providers/UserContext';

const useStyles = makeStyles((theme) => ({
    headerExam: {
        marginTop: theme.spacing(2),
    },
    btnExam: {
        padding: '10px 30px',
        borderRadius: '30px',
    },
    txtResum: {
        fontWeight: 'bold',
        color: theme.palette.primary.main,
    },
    titResum: {
        fontWeight: 'bold',
        fontSize: '20px',
        marginBottom: theme.spacing(1),
    },
    txtTitleDialog: {
        fontWeight: 'bold',
        color: theme.palette.letters.main,
    },
    inputTxt: {
        width: '50px',
        margin: '0px 10px',
    }
}));

//controlador para el examen
const controlExam = new ExamC();

const ConfigExamV = () => {
    //======= VARIABLE ESTILOS =======
    const classes = useStyles();
    const navigate = useNavigate();

    const [openSetting, setOpenSetting] = useState(false)
    const [select, setSelect] = useState(null)
    const [error, setError] = useState(true)
    const [typeExam, setTypeExam] = useState(null)
    const [openMauth, setOpenMauth] = useState(false);

    const { user } = useContext(UserContext);
    const { setAlert } = useContext(HomeContext);
    const { param, setParam } = useContext(ExamContext);

    const handleSelect = (e) => {
        setSelect(e.target.value)
    }

    useEffect(() => {
        if (typeExam === null) {
            controlExam.getType().then((res) => {
                console.log(res)
                if (res.ok) {
                    setTypeExam(res.data)
                } else {
                    setAlert({ message: res.message, type: 'error', status: true })
                }
            }).catch((err) => {
                console.log(err)
                setAlert({ message: err.message, type: 'error', status: true })
            })
        }
    }, [typeExam])

    const next = () => {
        if (select) {
            if (select !== '1') {
                let paramSelect = typeExam.filter((item) => item.id === parseInt(select))[0]
                setParam({
                    id: paramSelect.id,                          // id del tipo de examen
                    time: paramSelect.time,                      // minutos
                    questions: paramSelect.quantity_question,    // preguntas
                    minApproved: paramSelect.min_approved,       // preguntas malas como maximo
                })
            }
            setOpenSetting(true)
        } else {
            setAlert({ message: 'Debe seleccionar un tipo', type: 'info', status: true })
        }
    }

    //============================= FORMIK =================================
    const validate = values => {
        const errors = {};
        const numerosRegEx = /^[0-9]+$/;

        if (!values.time) {
            errors.time = 'Obligatorio';
        } else if (!numerosRegEx.test(values.time)) {
            errors.time = 'Solo números';
        } else if (values.time > 120) {
            errors.time = 'Max 120';
        }

        if (!values.questions) {
            errors.questions = 'Obligatorio';
        } else if (!numerosRegEx.test(values.questions)) {
            errors.questions = 'Solo números';
        } else if (values.questions > 460) {
            errors.questions = 'Max 460';
        }

        if (!values.minApproved) {
            errors.minApproved = 'Obligatorio';
        } else if (!numerosRegEx.test(values.minApproved)) {
            errors.minApproved = 'Solo números';
        } else if (values.minApproved > 100) {
            errors.minApproved = 'Max 100%';
        } else if (values.minApproved < 10) {
            errors.minApproved = 'Min 10%';
        }

        if (Object.keys(errors).length === 0) {
            let setting = {
                id: select,
                time: values.time,
                questions: values.questions,
                minApproved: values.minApproved,
            }
            setError(false)
            setParam(setting)
        } else {
            setError(true)
        }

        return errors;
    };
    const formik = useFormik({
        initialValues: {
            time: '',
            questions: '',
            minApproved: '',
        },
        validate
    });

    const handleExam = () => {
        if (user) {
            navigate('/exam/release')
        }else{
            setOpenMauth(true)
        }
    }

    return (
        <EstructuraV
            render={() => (
                <Grid container alignItems='center' direction='column' spacing={6}>

                    {/* MODAL PAGINA */}
                    <Dialog
                        open={openMauth}
                        onClose={() => setOpenMauth(false)}
                        aria-labelledby="alert-auth"
                        aria-describedby="alert-auth"
                    >
                        <DialogTitle id="alert-auth-title" align="center" className={classes.txtTitleDialog}>
                            Se detecto que no tiene una cuenta
                        </DialogTitle>
                        <DialogContent>
                            <Grid container alignItems="center" justifyContent='center' className={classes.txtDescDialog}>
                                <Grid item>
                                    Puede ver el resultado del examen sin iniciar sesión, pero no se guardará.
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => navigate('/exam/release')}
                            >Realizar examen</Button>
                            <Button
                                onClick={() => navigate('/login')}
                            >Registrarse</Button>
                        </DialogActions>
                    </Dialog>

                    {/* MODAL SETTING */}
                    <Dialog
                        open={openSetting}
                        onClose={() => setOpenSetting(false)}
                        aria-labelledby="Configuracion del examen"
                        aria-describedby="Debera configurar el examen para continuar"
                    >
                        <DialogTitle id="alert-dialog-title" align="center" className={classes.txtTitleDialog}>
                            Configuracion del Examen
                        </DialogTitle>
                        <DialogContent>
                            {select === '1' ? (
                                <Grid container direction='column'>
                                    <Grid item align='center' className={classes.titResum}>
                                        Ingrese la configuración
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <span className={classes.txtResum}>Tiempo:</span>
                                        <TextField
                                            id="time"
                                            variant="standard"
                                            className={classes.inputTxt}
                                            value={formik.values.time}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.errors.time && formik.touched.time}
                                            helperText={formik.errors.time && formik.touched.time && formik.errors.time}
                                        /> Minutos
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <span className={classes.txtResum}>Cantidad de preguntas:</span>
                                        <TextField
                                            id="questions"
                                            variant="standard"
                                            className={classes.inputTxt}
                                            value={formik.values.questions}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.errors.questions && formik.touched.questions}
                                            helperText={formik.errors.questions && formik.touched.questions && formik.errors.questions}
                                        />
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <span className={classes.txtResum}>Porcentaje para aprobar:</span>
                                        <TextField
                                            id="minApproved"
                                            variant="standard"
                                            className={classes.inputTxt}
                                            value={formik.values.minApproved}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.errors.minApproved && formik.touched.minApproved}
                                            helperText={formik.errors.minApproved && formik.touched.minApproved && formik.errors.minApproved}
                                        /> %
                                    </Grid>
                                </Grid>

                            ) : (
                                param &&
                                <Grid container direction='column'>
                                    <Grid item align='center' className={classes.titResum}>
                                        Resumen
                                    </Grid>
                                    <Grid item>
                                        <span className={classes.txtResum}>Tiempo:</span> {param.time} Minutos
                                    </Grid>
                                    <Grid item>
                                        <span className={classes.txtResum}>Cantidad de preguntas:</span> {param.questions}
                                    </Grid>
                                    <Grid item>
                                        <span className={classes.txtResum}>Porcentaje para aprobar:</span> {param.minApproved}%
                                    </Grid>
                                </Grid>
                            )
                            }
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenSetting(false)}>Cancelar</Button>
                            <Button
                                disabled={(error && select === '1')}
                                onClick={handleExam}
                            >Continuar</Button>
                        </DialogActions>
                    </Dialog>
                    {typeExam ? (
                        <>
                            <Grid item className={classes.headerExam}>
                                Elige el formato del examen
                            </Grid>
                            <Grid item container justifyContent='center' spacing={3}>
                                <FormControl>
                                    <FormLabel id="formato_examen">Formato del examen</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="formato_examen"
                                        name="formato_examen_radio"
                                    >
                                        {typeExam.map((item, index) => (
                                            <FormControlLabel key={index} value={item.id} onChange={handleSelect} control={<Radio />} label={item.type} />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item container justifyContent='center' spacing={1}>
                                <Grid item>
                                    <Button variant='contained' onClick={next} className={classes.btnExam}>Siguiente</Button>
                                </Grid>
                            </Grid>
                        </>
                    ) : (
                        <Loading text='Buscando tipos de examen' />
                    )
                    }
                </Grid>
            )
            }
        />)
}

export default ConfigExamV