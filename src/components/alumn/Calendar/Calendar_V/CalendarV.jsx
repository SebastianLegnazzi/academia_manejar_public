import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';

//============== MERCADO PAGO ==============
import { initMercadoPago } from '@mercadopago/sdk-react'

//============== CONTEXTS ==============
import { CalendarContext } from '../../../Providers/CalendarContext';
import { UserContext } from '../../../Providers/UserContext';
import { HomeContext } from '../../../Providers/HomeContext';

//============== COMPONENTES ==============
import EstructuraV from '../../../estructura/EstructuraV';
import InstructoresV from './InstructoresV';
import CalendarDaysV from './CalendarDaysV';
import CalendarTimeV from './CalendarTimeV';
import ResumeV from './ResumeV';
//===============CONTROLLERS==================
import CalendarC from '../Calendar_C/CalendarC';

//============== MATERIAL UI ==============
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, Radio,
  RadioGroup, Step, StepLabel, Stepper, Typography
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { WarningAmberOutlined, WbSunny, Brightness6 } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

//============== STYLES ==============
const useStyles = makeStyles((theme) => ({
  container: {
    background: theme.background.style1,
    height: '100%',
    minHeight: '80vh',
    paddingBottom: '20px'
  },

  horariosContent: {
  },
  horarios: {
    marginTop: '0px',
  },
  txtTitleDialog: {
    color: theme.palette.letters.main,
  },
  txtDescDialog: {
    fontSize: "1rem",
  },
  stepper: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'start',
    },
  },
  stepperProps: {
    color: '#FFFFFF !important',
  },
  titleStep: {
    color: '#FFFFFF',
    marginTop: '30px',
    marginBottom: '20px',
  },
  morning: {
    backgroundColor: 'rgba(240, 184, 126, 1)',
    marginRight: '20px',
    padding: '30px 0px',
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      marginRight: '0px',
      marginBottom: '5px',
    },
    borderRadius: '50px',
  },
  afternoon: {
    backgroundColor: 'rgba(143, 143, 143, 1)',
    padding: '30px 0px',
    cursor: 'pointer',
    borderRadius: '50px',
  },
  radioGroup: {
  },
  titleTime: {
    fontSize: '2rem',
    fontWeight: '600',
    alignSelf: 'center',
    color: '#FFFFFF',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.4rem',
    },
  },
  subTitleTime: {
    fontSize: '1rem',
    color: '#cccccc',
    fontWeight: '400',
    textAlign: 'end',
    alignSelf: 'center',
    marginRight: '10px',
  },
  cronometro: {
    margin: '0px 8px',
  },
  textColor: {
    color: 'black',
  }
}));

//================ CONTROLLER ================
const controllerCalendar = new CalendarC();

//================ CONTROLLER ================
initMercadoPago('TEST-10301cb2-aefd-47d0-af29-cd67b8d2a481');   //Key de mercado pago 

//============== Titulos de los steps ==============
const steps = ['Horario de Preferencia',
  'Instructores y Autos',
  'Fecha de Comienzo',
  'Horario de clases',
  'Resumen'];

//============== COMPONENTE ==============
const CalendarV = () => {
  //======= VARIABLE ESTILOS =======
  const classes = useStyles();

  //======= USE CONTEXT =======
  const { horario,
    setHorario,
    setRangesDate,
    setRangesTime,
    calendar,
    setCalendar,
    setInstructsCars,
    instructCarSelected,
    dateSelected,
    loading,
    setLoading,
    course,
    setCourse,
    turnCreated,
    setTurnCreated,
    editTurn,
    getTurnsDates,
    setTimeSelected,
    calendarProvReset
  } = useContext(CalendarContext);

  const { user } = useContext(UserContext);

  const {
    courses,
    setAlert,
    setOpenModal,
  } = useContext(HomeContext);

  //============== funcionalidad de los steps ==============
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [intervalReading, setIntervalReading] = useState(null);
  const [openMPago, setOpenMPago] = useState(false);
  const [linkPay, setLinkPay] = useState(null);
  const [ingreso, setIngreso] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(20 * 60); // TIEMPO DE ESPERA PARA LA RESERVA

  const navigate = useNavigate();

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  //cambia de seccion, va hacía la siguiente o a la última
  const handleNext = () => {
    let newSkipped = skipped;

    if (activeStep === 2) { //esto quiere decir que ya escogió un día y se le apartará en el turno
      if (turnCreated && dateSelected !== turnCreated.date_turn_ini) {
        setTimeSelected(null);
        editTurn(); //edito turno otra vez porq cambio la fecha
      } else {
        setTurn();
      }
    } else if (activeStep === 3) { //si es 3 edita el turno porque ahora escogió los horarios
      editTurn();
    }

    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    setLoading(true);
  };

  //vuelve a la sección anterior
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //cambia al horario seleccionado
  const handleChangeRadio = (event) => {
    if (event.target.value !== horario) {
      setInstructsCars(null);
    }
    setHorario(event.target.value);
  };

  const handleContainerClick = (value) => {
    if (value !== horario) {
      setInstructsCars(null);
    }
    setHorario(value);
  };

  //============== funcionalidades generales ==============
  useEffect(() => {
    if(!ingreso){
      console.log('cleanup')
      calendarProvReset();
      setIngreso(true);
    }
    setLoading(false);
    const cleanup = startInterval();
    if (courses) { //obtiene los cursos que s emuestran en el home
      
      let course = courses.find(c => c.id === parseInt(localStorage.getItem('course')));
      setCourse(course);
    };
    if (!calendar) {

      controllerCalendar.getCalendar().then((data) => {
        if (data.ok) {
          setCalendar(data.data.calendar);
          setRangesDate({ ini: data.data.calendar.day_start, end: data.data.calendar.day_end });
          setRangesTime({ ini: data.data.calendar.time_start, end: data.data.calendar.time_end });
        }
      })
        .catch((error) => {
          console.log(error);
        });
    }
    return () => {
      cleanup(); // Detener el intervalo al desmontar el componente
    };
  }, [courses]);

  // intervalo que se ejcuta cada 1 minuto despues de pasar al calendario
  const startInterval = () => {
    setIntervalReading(true);
    const intervalId = setInterval(() => {
      if (!intervalReading) {
        getTurnsDates(true);
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }


  //Funcion que controla el tiempo de la reserva
  useEffect(() => {
    const accionAlTerminar = () => {
      calendarProvReset();
      setAlert({ message: 'Se ha terminado el tiempo para realizar la reserva, por favor vuelva a intentarlo.', type: 'error', status: true })
      navigate('/');
      clearInterval(intervalId);
    };

    const temporizadorId = setTimeout(accionAlTerminar, tiempoRestante * 1000);

    const intervalId = setInterval(() => {
      if (tiempoRestante > 0) {
        setTiempoRestante(prevTiempo => prevTiempo - 1);
      }
    }, 1000);

    // Limpia el temporizador y el intervalo si el componente se desmonta antes de que termine
    return () => {
      clearTimeout(temporizadorId);
      clearInterval(intervalId);
    };
  }, []);

  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;

  //vuelve a la sección anterior
  const setTurn = () => {
    let date = dayjs(dateSelected);
    console.log(dayjs(date).businessDaysAdd(course.cant_class - 1).format('YYYY-MM-DD 00:00:00'))
    controllerCalendar.saveTurn(
      {
        dateTurnIni: date.format('YYYY-MM-DD 00:00:00'),
        dateTurnEnd: dayjs(date).businessDaysAdd(course.cant_class - 1).format('YYYY-MM-DD 00:00:00'),
        carId: instructCarSelected.idCar,
        courseId: course.id,
        userAlumnId: user.id,
        instructTimestampId: instructCarSelected.idInstrTime,
      }, 'save').then((data) => {
        if (data.ok) {
          setTurnCreated(data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Funcion que crea la deuda y el boton de pago y lo renderiza
  const handlePay = () => {
    if (!linkPay) {
      setOpenModal({ open: true, title: 'Generando Boleta', message: 'Generando link del pago...', loading: true });
      controllerCalendar.createPreference(course.title, course.price, course.price_reservation, user.id, turnCreated.id, tiempoRestante)
        .then((data) => {
          setOpenModal({ open: false, title: '', message: '', loading: false });
          console.log(data)
          if (data.ok) {
            setOpenMPago(true);
            setLinkPay(data.data);
          } else {
            setAlert({ open: true, message: 'Error al intentar el pago, porfavor intentelo mas tarde o comuniquese con sistema.', type: 'error' })
            console.log(data.message);
          }
        }).catch((error) => {
          setAlert({ open: true, message: 'Error al intentar el pago, porfavor intentelo mas tarde o comuniquese con sistema.', type: 'error' })
          console.log(error);
        }).finally(() => {
          setOpenModal({ open: false, title: '', message: '', loading: false });
        });
    } else {
      setOpenMPago(true)
    }
  }

  //======= VISTA =======
  return (
    <EstructuraV
      render={() => (
        <Grid item container className={classes.container}>
          <Dialog
            open={openMPago}
            onClose={() => setOpenMPago(false)}
            aria-labelledby="Esperando"
            aria-describedby="Esperando a cargar la pagina"
          >
            <DialogTitle id="alert-dialog-title" align="center" className={classes.txtTitleDialog}>
              Link de pago
            </DialogTitle>
            <DialogContent>
              <Grid container alignItems="center" justifyContent='center' className={classes.txtDescDialog}>
                <Grid item>
                  <WarningAmberOutlined style={{ fontSize: 15 }} /> Tendra {minutos} minutos para realizar el pago, de lo contrario se cancelara la reserva.
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              {linkPay &&
                <Button onClick={() => window.location.href = linkPay} variant="contained">
                  Pagar
                </Button>
              }
            </DialogActions>
          </Dialog>
          <Grid container justifyContent='center' alignItems='center'>
            <Grid item container justifyContent='center' component='h1' className={classes.titleTime}>
              Reserva del turno
            </Grid>
            <Grid item container justifyContent='end' component='h2' className={classes.subTitleTime}>
              Le quedan <span className={classes.cronometro}>{minutos}</span> minutos y <span className={classes.cronometro}>{segundos}</span> segundos
            </Grid>
          </Grid>
          <Grid container justifyContent='center'>
            <Box sx={{ width: '95%' }}>
              <Stepper activeStep={activeStep} className={classes.stepper}>
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps} >
                        <Typography color='white'>
                          {label}
                        </Typography>
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <>
                {activeStep === 0 ? (
                  <RadioGroup
                    aria-label="options"
                    name="options"
                    value={horario}
                    onChange={handleChangeRadio}
                  >
                    <Grid item justifyContent='center' component='h2' className={classes.titleStep}>Seleccione su franja horaria</Grid>
                    <Grid container justifyContent='center' alignItems='center' className={classes.horariosContent}>
                      <Grid item container justifyContent='center' xs={12} md={5} className={`${classes.morning}`} onClick={() => handleContainerClick('morning')}>
                        <FormControlLabel
                          className={classes.radioGroup} value="morning"
                          control={<Radio />}
                          label={
                            <Grid container spacing={1} alignItems='center' >
                              <Grid item component='h2' className={classes.textColor}>MAÑANA</Grid>
                              <Grid item ><WbSunny /></Grid>
                            </Grid>} />
                      </Grid>
                      <Grid item container justifyContent='center' xs={12} md={5} className={`${classes.afternoon}`} onClick={() => handleContainerClick('afternoon')}>
                        <FormControlLabel value="afternoon" control={<Radio />}
                          label={
                            <Grid container spacing={1} alignItems='center'>
                              <Grid item component='h2' className={classes.textColor}>TARDE</Grid>
                              <Grid item ><Brightness6 /></Grid>
                            </Grid>} />
                      </Grid>
                    </Grid>
                  </RadioGroup>
                ) : (
                  activeStep === 1 ? (
                    <Grid>
                      <Grid item justifyContent='center' component='h2' className={classes.titleStep}>Seleccione el instructor y vehiculo</Grid>
                      <InstructoresV />  {/* Instructores con sus autos */}
                    </Grid>
                  ) : (
                    activeStep === 2 ? (
                      <Grid>
                        <Grid item justifyContent='center' component='h2' className={classes.titleStep}>Seleccione el dia de preferencia</Grid>
                        <CalendarDaysV /> {/* Dias del calendario disponibles del instruvtor escogido*/}
                      </Grid>
                    ) : (
                      activeStep === 3 ? (
                        <Grid container justifyContent='center'>
                          <Grid item justifyContent='center' component='h2' className={classes.titleStep}>Seleccione el horario</Grid>
                          <CalendarTimeV /> {/* Horarios disponibles de la fecha elegida */}
                        </Grid>
                      ) : (
                        activeStep === 4 ? (
                          <Grid container justifyContent='center'>
                            <Grid item justifyContent='center' component='h2' className={classes.titleStep}>Verifique que los datos sean correctos</Grid>
                            <ResumeV /> {/* Resumen de los datos del turno */}
                          </Grid>
                        ) : (
                          <Grid>
                            Otro caso aquí {/* Por si pinta poner otro caso */}
                          </Grid>
                        )
                      )
                    )
                  )
                )}
                {/* Botones de volver, seguir y finalizar  */}
                <Grid item className={classes.containerBtn}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }} >
                    <Button
                      className={classes.btnBack}
                      variant='contained'
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}>
                      Volver
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {activeStep === steps.length - 1 ? (
                      <Button onClick={handlePay} variant="contained">
                        Hacer Reservación
                      </Button>
                    ) : (
                      activeStep === 1 ? (
                        <Button onClick={() => { getTurnsDates(); handleNext(); startInterval() }} disabled={loading} variant="contained">
                          Calendario
                        </Button>
                      ) : (
                        <Button onClick={handleNext} variant="contained" disabled={loading}>
                          Siguiente
                        </Button>
                      )
                    )}
                  </Box>
                </Grid>
              </>
            </Box >
          </Grid >
        </Grid>
      )} />
  )
}

export default CalendarV
