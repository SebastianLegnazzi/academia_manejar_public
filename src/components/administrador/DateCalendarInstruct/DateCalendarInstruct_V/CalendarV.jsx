import React, { useContext, useState } from 'react'

//============== COMPONENTES ==============
import { Button, Grid, Tooltip, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { HomeContext } from '../../../Providers/HomeContext';

import DateCalendarInstructC from '../DateCalendarInstruct_C/DateCalendarInstructC';

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
  txtHeader: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    margin: '20px 0px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.7rem',
    },
  },
  input: {
    width: '50%',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('lg')]: {
      width: '80%',
    },
  }
}));


const DCIController = new DateCalendarInstructC();

const CalendarV = () => {

  //======= USE STATE =======
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  //======= USE CONTEXT =======
  const { setOpenModal, setAlert } = useContext(HomeContext);


  //============ FUNCIONES =================

  const handleSave = () => {
    if (startDate && endDate && startTime && endTime) {
      if (startDate <= endDate && startTime <= endTime) {
        setOpenModal({ message: 'Cargando nuevo calendario', title: '', subTitle: '', open: true, loading: true });
        const objDate = {
          startDate: dayjs(startDate).format('YYYY-MM-DD'), // Formato personalizado de fecha
          endDate: dayjs(endDate).format('YYYY-MM-DD'), // Formato personalizado de fecha
          startTime: dayjs(startTime).format('HH:mm:ss'), // Formato personalizado de hora
          endTime: dayjs(endTime).format('HH:mm:ss'), // Formato personalizado de hora
        }
        DCIController.saveCalendar(objDate).then((resp) => {
          setOpenModal({ message: '', title: '', subTitle: '', open: false, loading: false });
          if (resp.ok) {
            setAlert({ message: resp.message, type: 'success', status: true });
            setStartDate(null);
            setEndDate(null);
            setStartTime(null);
            setEndTime(null);
          } else {
            setAlert({ message: resp.message, type: 'error', status: true });
          }
        }).catch((error) => {
          setOpenModal({ message: '', title: '', subTitle: '', open: false, loading: false });
          setAlert({ message: 'Error al guardar el calendario', type: 'error', status: true });
          console.log(error)
        })
      } else {
        setAlert({ message: 'La fecha de inicio no puede ser mayor a la fecha de fin', type: 'error', status: true })
      }
    } else {
      setAlert({ message: 'LLene todos los campos para guardar!', type: 'info', status: true })
    }
  }

  //======= VARIABLE ESTILOS =======
  const classes = useStyles();

  //======= VISTA =======
  return (
    <Grid container justifyContent='center'>
      <Grid item>
        <Typography variant='h4' align='center' className={classes.txtHeader}>
          Horarios del Calendario
        </Typography>
      </Grid>
      <Grid item xs={12} align='center'>
        {!startDate || !startTime ? (

          <Typography variant='p' align='center' className={classes.txtHeader}>
            Ingrese los horarios de inicio
          </Typography>
        ) : (
          <Typography variant='p' align='center' className={classes.txtHeader}>
            Ingrese los horarios de fin
          </Typography>
        )
        }
      </Grid>
      <Grid item container spacing={2}>
        <Grid item md={6} container justifyContent='center'>
          <DatePicker
            label="Fecha de inicio"
            value={startDate}
            className={classes.input}
            disablePast // Deshabilita los meses anteriores
            onChange={(newValue) => {
              setEndDate(null);
              setStartDate(newValue);
            }}
          />
        </Grid>
        <Grid item md={6} container justifyContent='center'>
          <DatePicker
            label="Fecha de fin"
            value={endDate}
            disablePast // Deshabilita los meses anteriores
            className={classes.input}
            disabled={!startDate}
            minDate={startDate}
            onChange={(newValue) => setEndDate(newValue)}
          />
        </Grid>
        <Grid item md={6} container justifyContent='center'>
          <TimePicker
            label="Fecha de inicio"
            value={startTime}
            className={classes.input}
            onChange={(newValue) => {
              setEndTime(null);
              setStartTime(newValue)
            }}
          />
        </Grid>
        <Grid item md={6} container justifyContent='center'>
          <TimePicker
            label="Seleccione una hora"
            value={endTime}
            className={classes.input}
            disabled={!startTime}
            minTime={startTime}
            onChange={(newValue) => setEndTime(newValue)}
          />
        </Grid>
        <Grid item xs={12} container justifyContent='center'>
          <Button
            variant='contained'
            onClick={handleSave}
            className={classes.btnSave}
          >Guardar
          </Button>
        </Grid>
      </Grid >
    </Grid >
  )


}

export default CalendarV
