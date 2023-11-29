import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Grid,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import { CalendarContext } from '../../../Providers/CalendarContext';
import FullCalendar from '@fullcalendar/react';
import CalendarC from '../Calendar_C/CalendarC';
import dayjs from 'dayjs';
import Loading from '../../../estructura/Loading';

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
  container: {
    color: 'white',
  },
  disabledDate: {
    pointerEvents: 'none',
    backgroundColor: '#f0f0f0',
    color: 'black',
  },
  enabledDate: {
    background: '#008bf0',
    '&:hover': {
      background: 'radial-gradient(circle, rgba(0,139,240,1) 0%, rgba(63,107,187,1) 100%, rgba(0,139,240,1) 100%)',
    },
  },
  selectedDate: {
    background: 'radial-gradient(circle, rgba(0,141,244,1) 0%, rgba(0,84,145,1) 90%, rgba(63,107,187,1) 100%)',
    color: '#d2c5ff'
  },
}));

const controllerCalendar = new CalendarC();

const CalendarDaysV = () => {

  //======= CONTEXTS =======
  const { dateSelected,
    setDateSelected,
    rangesDate,
    availableDays,
    loading,
    setLoading,
  } = useContext(CalendarContext);

  //======= VARIABLE ESTILOS =======
  const [prevSelectedDate, setPrevSelectedDate] = useState(null);

  const classes = useStyles();
  const calendarRef = useRef(null);

  //======= FUNCIONES =======
  const handleDateClick = (event, changeDate = true) => {
    const dateStr = event.dateStr;
    // Elimina el estilo de la fecha previamente seleccionada
    if (prevSelectedDate && availableDays) {
      const prevDayElement = calendarRef.current.getApi().el.querySelector(`[data-date="${prevSelectedDate}"]`);
      if (prevDayElement) {
        prevDayElement.classList.remove(classes.selectedDate);
      }
    }
    // Aplica el estilo a la nueva fecha seleccionada
    const dayElement = calendarRef.current.getApi().el.querySelector(`[data-date="${dateStr}"]`);
    if (dayElement && !dayElement.classList.contains('disabledDate')) {
      dayElement.classList.add(classes.selectedDate);
      // Actualiza la fecha previamente seleccionada
      setPrevSelectedDate(dateStr);
      if (changeDate) {
        setDateSelected(dateStr);
      }
    }


    setLoading(false);
  };


  useEffect(() => {
    setLoading(true);
    if (dateSelected) {
      handleDateClick({ dateStr: dayjs(dateSelected).format('YYYY-MM-DD') }, false);
      setLoading(false);
    }
    if (availableDays && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const updateDisabledDates = () => {
        const dayElements = calendarApi.el.querySelectorAll('.fc-day');
        dayElements.forEach((dayEl) => {
          const date = dayEl.getAttribute('data-date');
          if (availableDays && !availableDays.includes(date)) {
            dayEl.classList.add(classes.disabledDate);
            dayEl.classList.remove(classes.enabledDate);
            dayEl.classList.add('disabledDate');
          } else {
            dayEl.classList.remove(classes.disabledDate);
            dayEl.classList.remove('disabledDate');
            dayEl.classList.add(classes.enabledDate);
          }
        });
      };
      calendarApi.batchRendering(() => {
        updateDisabledDates();
      });
      calendarApi.on('datesSet', updateDisabledDates);
    }
  }, [availableDays, classes.disabledDate]);

  const calculateValidRange = () => {

    if (availableDays.length === 0) {
      // Si no hay días disponibles, se establece un rango vacío
      return null;
    }

    const dates = availableDays.map(fecha => new Date(fecha));

    const minDate = dayjs(new Date(Math.min(...dates))).add(1, 'day').format('YYYY-MM-DD');  // Primer día disponible
    let maxDate = new Date(Math.max(...dates));  // Último día disponible
    maxDate = dayjs(maxDate).add(2, 'day').format('YYYY-MM-DD');
    return {
      start: minDate,
      end: maxDate,
    };
  };


  //======= VISTA =======
  return (
    <Grid container>
      {availableDays ? (
        <Grid item xs={12} className={classes.container}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView={'dayGridMonth'}
            hiddenDays={[0, 6]}
            validRange={calculateValidRange()}
            dateClick={handleDateClick}
            locales={[esLocale]}
            locale="es"
            selectable={true}
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'today',
            }}
          />
        </Grid>
      ) : (
        <Grid><Loading text='Cargando datos del Calendario' /></Grid>
      )}
    </Grid>
  )
}

export default CalendarDaysV