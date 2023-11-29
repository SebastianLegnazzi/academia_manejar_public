import React, { useContext, useEffect, useState } from 'react'

//============== COMPONENTES ==============
import { Button, Grid, MenuItem, Select, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
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
  },
}));


const DCIController = new DateCalendarInstructC();

const InstructV = () => {

  //======= USE STATE =======
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [instructorSelect, setInstructorSelect] = useState('');

  //======= USE CONTEXT =======
  const { setOpenModal, setAlert } = useContext(HomeContext);

  useEffect(() => {
    if (!instructor) {
      setOpenModal({ message: 'Cargando instructores', title: '', subTitle: '', open: true, loading: true });
      DCIController.searchInstruct().then((resp) => {
        setOpenModal({ message: '', title: '', subTitle: '', open: false, loading: false });
        if (resp.ok) {
          console.log(resp.data)
          setInstructorSelect(resp.data[0].id);
          setInstructor(resp.data);
        } else {
          setAlert({ message: resp.message, type: 'error', status: true });
        }
      }).catch((error) => {
        setOpenModal({ message: '', title: '', subTitle: '', open: false, loading: false });
        setAlert({ message: 'Error al buscar los instructores', type: 'error', status: true });
        console.log(error)
      })
    }
  }, [instructor])

  //============ FUNCIONES =================

  const handleSave = () => {
    if (startTime && endTime) {
      if (startTime <= endTime) {
        setOpenModal({ message: 'Cargando horario del instructor', title: '', subTitle: '', open: true, loading: true });
        const objDate = {
          startTime: dayjs(startTime).format('HH:mm:ss'), // Formato personalizado de hora
          endTime: dayjs(endTime).format('HH:mm:ss'), // Formato personalizado de hora
        }
        DCIController.saveInstructTimestamp(objDate, instructorSelect).then((resp) => {
          setOpenModal({ message: '', title: '', subTitle: '', open: false, loading: false });
          if (resp.ok) {
            setAlert({ message: resp.message, type: 'success', status: true });
            setStartTime(null);
            setEndTime(null);
          } else {
            setAlert({ message: resp.message, type: 'error', status: true });
          }
        }).catch((error) => {
          setOpenModal({ message: '', title: '', subTitle: '', open: false, loading: false });
          setAlert({ message: 'Error al guardar el horario', type: 'error', status: true });
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
          Horarios del instructor
        </Typography>
      </Grid>
      <Grid item xs={12} align='center'>
        {!instructor ? (
          <Typography variant='p' align='center' className={classes.txtHeader}>
            Ingrese el instructor
          </Typography>
        ) : !startTime ? (
          <Typography variant='p' align='center' className={classes.txtHeader}>
            Ingrese el horario de inicio
          </Typography>
        ) : (
          <Typography variant='p' align='center' className={classes.txtHeader}>
            Ingrese el horario de fin
          </Typography>
        )
        }
      </Grid>
      <Grid item container spacing={2}>
        <Grid item md={12} container justifyContent='center'>
          <Select
            labelId="instructor-select"
            id="instructor-select"
            value={instructorSelect}
            label="Instructor"
            className={classes.inputInstr}
            onChange={(e) => setInstructorSelect(e.target.value)}
          >
            {instructor && instructor.map((item, index) => (
              <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
            ))}
          </Select>
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

export default InstructV
