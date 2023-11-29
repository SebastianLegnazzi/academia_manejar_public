import React, { createContext, useEffect, useState } from 'react';
import CalendarC from '../alumn/Calendar/Calendar_C/CalendarC';
import dayjs from 'dayjs';

// Crear un contexto
const CalendarContext = createContext();




// Crear el componente Provider
const CalendarProvider = ({ children }) => {

    const controllerCalendar = new CalendarC();

    // Aquí puedes definir el estado o los datos que deseas proporcionar en el contexto.
    const [course, setCourse] = useState({ price: 0, priceReservation: 0, title: '', cantClass: '' });
    const [calendar, setCalendar] = useState(null);
    const [horario, setHorario] = useState('morning');
    const [dateSelected, setDateSelected] = useState('');
    const [rangesDate, setRangesDate] = useState({ ini: '', end: '' });
    const [rangesTime, setRangesTime] = useState({ ini: '', end: '' });
    const [availableDays, setAvailableDays] = useState(null);
    const [unavailableTimes, setUnavailableTimes] = useState(null);
    const [instructTurns, setInstructTurns] = useState(null);
    const [instructsCars, setInstructsCars] = useState(null);
    const [instructCarSelected, setInstructCarSelected] = useState(1);
    const [loading, setLoading] = useState(false);
    const [timeSelected, setTimeSelected] = useState();
    const [turnCreated, setTurnCreated] = useState(null);
    const [eventsTime, setEventsTime] = useState(null);
    const [ turnsObject, setTurnsObject] = useState(null);
    const [ firstTurns, setFirstTurns] = useState(null);

    const calendarProvReset = () => {
        setCourse({ price: 0, priceReservation: 0, title: '', cantClass: '' });
        setCalendar(null);
        setHorario('morning');
        setDateSelected('');
        setRangesDate({ ini: '', end: '' });
        setRangesTime({ ini: '', end: '' });
        setAvailableDays(null);
        setUnavailableTimes(null);
        setInstructTurns(null);
        setInstructsCars(null);
        setInstructCarSelected(1);
        setLoading(false);
        setTimeSelected();
        setTurnCreated(null);
        setEventsTime(null);
        setTurnsObject(null);
        setFirstTurns(null);
    }

    //vuelve a la sección anterior
    const editTurn = () => {
        console.log(turnCreated)
        controllerCalendar.saveTurn(
            {
                turnId: turnCreated.id,
                dateTurnIni: dayjs(dateSelected).format('YYYY-MM-DD H:mm:ss'),
                dateTurnEnd: dayjs(dateSelected).businessDaysAdd(course.cant_class).add(30, 'minutes').format('YYYY-MM-DD H:mm:ss'),
                carId: turnCreated.car_id,
                courseId: turnCreated.courses_id,
                userAlumnId: turnCreated.user_alumn_id,
                instructTimestampId: turnCreated.instruct_timestamp_id,
                userPaymentId: null,
            }, 'edit').then((data) => {
                console.log(data)
                if (data.ok) {
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    /**
   * se encarga de obtener los turnos disponibles
   */
    const getTurnsDates = (actualizacion=false) => {
        // setLoading(true);
        //busca los turnos dependiendo de los datos del instrcutor escogido
        console.log(instructCarSelected)
        controllerCalendar.getDatesTurns({
            id: instructCarSelected.idInstrTime, time_start: instructCarSelected.timeStartInstr, time_end: instructCarSelected.timeEndInstr
        }, horario, course.cant_class).then((data) => {
            if (data.ok) {
                const enabledDatesSet = new Set(data.data.turnsAvailables.map(item => item.date_turn_ini.split(' ')[0]));
                const enabledDates = Array.from(enabledDatesSet).map(date => date.split(' ')[0]);
                setAvailableDays(enabledDates);
                setInstructTurns(data.data.turnsInstruct)
                setTurnsObject(data.data.turnsAvailables)
                setFirstTurns(data.data.firstTurns)
                if (actualizacion) {
                    setDataSelected();
                }
            }
        })
            .catch((error) => {
                console.log(error);
            });
    }

    const setDataSelected = () => {
        console.log('actualizando los datos pue pinchi cabron')
    }

    return (
        <CalendarContext.Provider value={{
            course,
            setCourse,
            calendar,
            setCalendar,
            horario,
            setHorario,
            dateSelected,
            setDateSelected,
            rangesDate,
            setRangesDate,
            availableDays,
            setAvailableDays,
            unavailableTimes,
            setUnavailableTimes,
            rangesTime,
            setRangesTime,
            instructTurns,
            setInstructTurns,
            instructsCars,
            setInstructsCars,
            instructCarSelected,
            setInstructCarSelected, loading,
            setLoading,
            timeSelected,
            setTimeSelected,
            turnCreated,
            setTurnCreated,
            editTurn,
            getTurnsDates,
            eventsTime,
            setEventsTime,
            turnsObject,
            firstTurns,
            calendarProvReset
        }}>
            {children}
        </CalendarContext.Provider>
    );
};

export { CalendarContext, CalendarProvider };