import React, { useContext, useEffect, useState } from 'react';
import {
    Grid,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { CalendarContext } from '../../../Providers/CalendarContext';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayjs from 'dayjs';
import esLocale from '@fullcalendar/core/locales/es';
import interactionPlugin from "@fullcalendar/interaction"
import CalendarC from '../Calendar_C/CalendarC';
import { useRef } from 'react';
import Loading from '../../../estructura/Loading';

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
    container:{
        color: 'white',
    },
    eventSelected: {
        background: '#1c948e',
    },
    eventDesocupado: {
        backgroundColor: '#007cf7',
        '&:hover': {
            background: '#0051a1',
            
        },
    },
    eventOcupado: {
        backgroundColor: '#de1f00',
        color: '#fff',
        border: 'none',
    },
}));

const CalendarTimeV = () => {

    //================ CONTROLLER ================
    const controllerCalendar = new CalendarC();

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();
    const { dateSelected,
        setDateSelected,
        selectedDateSelected,
        horario,
        rangesTime,
        instructTurns,
        timeSelected,
        setTimeSelected,
        instructCarSelected,
        editTurn,
        course,
        eventsTime,
        setLoading,
        setEventsTime,
        turnsObject,
        turnCreated,
        firstTurns } = useContext(CalendarContext);
    const [range, setRange] = useState({})
    const [prevEvenSelected, setPrevEvenSelected] = useState(null);
    const calendarRef = useRef(null);

    const handleDateClick = (info) => {
        let event = info.event;
        if (event.title !== 'Ocupado') {
            if (prevEvenSelected) {
                if (prevEvenSelected.object) {
                    const eventos = calendarRef.current.getApi().getEvents();
                    let evento = eventos.find(even => dayjs(even.start).isSame(dayjs(dateSelected)));
                    evento.setProp('classNames', classes.eventDesocupado)
                    setEventsTime(eventsTime)
                } else {
                    prevEvenSelected.setProp('classNames', classes.eventDesocupado)
                };
            }
            event.setProp('classNames', classes.eventSelected);
            setPrevEvenSelected(event)
            setDateSelected(dayjs(info.event.start).format('YYYY-MM-DD HH:mm:ss'));
            setTimeSelected(
                {
                    ini: dateSelected,
                    end: dayjs(info.event.end).format('YYYY-MM-DD HH:mm:ss')
                });
        }
    };

    useEffect(() => {
        if (timeSelected) {
            setLoading(false);
        }
        generateEvents();
    }, [horario, rangesTime, timeSelected]);


    const generateEvents = () => {

        let ranges = {
            morning: {
                ini: instructCarSelected.timeStartInstr,
                end: '12:00:00'
            },
            afternoon: {
                ini: '12:00:00',
                end: instructCarSelected.timeEndInstr
            }
        };

        ranges = ranges[horario];  //obtiene los rangos de hora de inicio y hora fin
        setRange(ranges);
        let result = [];

        if (firstTurns && instructTurns) {
            result = instructTurns.filter(item => {
                //convierto las fechas a formato dayjs para poder compararlas y verificar si la fecha seleccionada se encuentra entre el rango de fechas 
                const turnEnd = dayjs(dayjs(item.date_turn_end).format('YYYY-MM-DD')); //convierto la fecha sin hora y le doy formato dayjs nuevamente ya que devuelve string
                const turnIni = dayjs(dayjs(item.date_turn_ini).format('YYYY-MM-DD'));
                const selectedDate = dayjs(dayjs(dateSelected).format('YYYY-MM-DD'));

                //verifico que la fecha seleccionada se encuentre entre el rango de fechas del turno
                return (turnEnd.isAfter(selectedDate) || turnEnd.isSame(selectedDate)) && (turnIni.isBefore(selectedDate) || turnIni.isSame(selectedDate));
            });
        } else {
            //Verifico que tenga turnos
            result = turnsObject.filter(turn => dayjs(dayjs(turn.date_turn_ini).format('YYYY-MM-DD')).isSame(dayjs(dayjs(dateSelected).format('YYYY-MM-DD'))));
        }

        const availableTimes = result.map(item => ({
            title: firstTurns ? 'Desocupado' : 'Ocupado',
            start: `${dateSelected} ${(dayjs(item.date_turn_ini)).format('HH:mm:ss')}`,
            end: `${dateSelected} ${dayjs(item.date_turn_ini).add(30, 'minute')}`,
            classNames: firstTurns ? [classes.eventDesocupado] : [classes.eventOcupado]
        })); //obtiene todos los horarios que no están disponibles

        const eventos = [];
        let fechaIni = dayjs(`${dateSelected} ${ranges.ini}`);
        const fechaEnd = dayjs(`${dateSelected} ${ranges.end}`);

        while (fechaIni.isBefore(fechaEnd)) { //mientras la fecha inicial sea anterior a la final sigue
            const fechaStart = fechaIni;
            fechaIni = fechaIni.add(30, 'minute');

            const isAvailable = availableTimes.some(time => dayjs(time.start).isSame(fechaStart)); //verifica si la fecha se encuentra en el array de fechas disponibles
            const evento = {
                start: fechaStart.format('YYYY-MM-DD HH:mm:ss'),
                end: fechaIni.format('YYYY-MM-DD HH:mm:ss'),
                title: firstTurns ? (isAvailable ? 'Ocupado' : 'Desocupado') : (isAvailable ? 'Desocupado' : 'Ocupado'),
                classNames: firstTurns ? (isAvailable ? [classes.eventDesocupado] : [classes.eventOcupado]) : isAvailable ? [classes.eventOcupado] : [classes.eventDesocupado]
            };  //crea el evento dependiendo de la fecha

            eventos.push(evento);
        }

        let events = [];

        if (eventos.length > 0) {
            events = eventos;
        } else {
            events = eventsTime;
        }

        if (dayjs(dateSelected).format('HH:mm:ss') !== '00:00:00') {
            let evento = events.find(event => event.start === dateSelected);
            evento.classNames = [classes.eventSelected];
            setLoading(false);
            setPrevEvenSelected({ evento, object: true })
        }

        const updatedEvents = events.map(event => {
            // Verifica si el título es "Ocupado"
            if (event.title === "Ocupado") {
                return { ...event, classNames: [classes.eventOcupado] };
            } else {
                if (event.start !== dateSelected) {
                    return { ...event, classNames: [classes.eventDesocupado] };
                } else {
                    return event;
                }

            }
        });
        setEventsTime(updatedEvents)
    };


    //======= VISTA =======
    return (
        <Grid item md={10} className={classes.container}>
            {instructTurns && range && range.ini && eventsTime && turnCreated ? (
                <FullCalendar
                    ref={calendarRef}
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridDay"
                    headerToolbar={{
                        left: '',
                        center: 'title',
                        right: '',
                    }}
                    eventClick={handleDateClick}
                    events={eventsTime}
                    allDaySlot={false}
                    nowIndicator={true}
                    height="auto"
                    fixedWeekCount={true} // Calendario con una vista fija
                    slotMinTime={range.ini}  // Establecer la hora de inicio
                    slotMaxTime={range.end}  // Establecer la hora de fin
                    initialDate={dateSelected}
                    locales={[esLocale]}  // Establece la localización en español
                    locale="es"  // Establece la localización en español
                />
            ) : (
                <Grid><Loading text='Cargando Horarios' /></Grid>
            )}
        </Grid>
    )
}

export default CalendarTimeV