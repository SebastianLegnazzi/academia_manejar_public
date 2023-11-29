import React, { useContext, useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Grid,
    Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { CalendarContext } from '../../../Providers/CalendarContext';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import businessDays from 'dayjs-business-days';
import { HomeContext } from '../../../Providers/HomeContext';
import MyCurseV from '../../MyCurse/MyCurse_V/MyCurseV';
import { UserContext } from '../../../Providers/UserContext';
import Loading from '../../../estructura/Loading';

dayjs.extend(customParseFormat);
dayjs.extend(businessDays);

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
    container: {
    },
    containerCards: {
        alignItems: 'center',
    }
}));

const ResumeV = () => {

    //======= CONTEXTS =======
    const {
        instructCarSelected,
        timeSelected,
        dateSelected,
        course,
        turnCreated
    } = useContext(CalendarContext);

    

    //USE STATES ==============
    const [timeSelectedHour, setTimeSelectedHour] = useState(null);
    const [dateSelectedTotal, setDateSelectedTotal] = useState(null);
    const [courseSelected, setCourseSelected] = useState(null);

    useEffect(() => {
        setCourseSelected(course);
        setDateSelectedTotal({
            ini: dayjs(dateSelected).format('DD/MM/YYYY'),
            end: dayjs(dateSelected).businessDaysAdd(course.cant_class - 1).format('DD/MM/YYYY')
        });
    }, []);


    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //======= VISTA =======
    return (
        <Grid item container className={classes.container}>
            {dateSelectedTotal && courseSelected? (
                <Grid item container  className={classes.containerCards} spacing={5}>
                    <Grid item xs={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    Resumen del Turno
                                </Typography>
                                <Typography variant="h5" component="div">
                                    Horario
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Desde las {dayjs(dateSelected).format('HH:mm')} hasta las {dayjs(dateSelected).add(30, 'minute').format('HH:mm')}
                                </Typography>
                                <Typography variant="h5" component="div">
                                    Fecha
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    A partir del {dateSelectedTotal.ini} Hasta el {dateSelectedTotal.end}
                                </Typography>
                                <Typography variant="h5" component="div">
                                    Instructor
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {instructCarSelected.name} {instructCarSelected.lastname}
                                </Typography>
                                <Typography variant="h5" component="div">
                                    Auto
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {instructCarSelected.model}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    Datos del curso
                                </Typography>
                                <Typography variant="h5" component="div">
                                    Curso
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {courseSelected.title}
                                </Typography>
                                <Typography variant="h5" component="div">
                                    Precio de Reservación
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {courseSelected.price_reservation}$
                                </Typography>
                                <Typography variant="h5" component="div">
                                    Precio Total
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {courseSelected.price}$
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            ) : (
                <Grid><Loading text='Cargando Datos del Resumen'/></Grid>
            )}
        </Grid>
    )
}

export default ResumeV