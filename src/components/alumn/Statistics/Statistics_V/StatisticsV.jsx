import React, { useContext, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import EstructuraV from '../../../estructura/EstructuraV';
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveTimeRange } from '@nivo/calendar';
import { ResponsivePie } from '@nivo/pie';
import StatisticsC from '../Statistics_C/StatisticsC';
import { UserContext } from '../../../Providers/UserContext';
import dayjs from 'dayjs';
import { DispositivoContext } from '../../../Providers/Dispositivo';
import Loading from '../../../estructura/Loading';


//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
    containerGraph: {
        width: '1200px',
        height: '300px',
        margin: 'auto auto 20px auto',
        [theme.breakpoints.down('lg')]: {
            width: '700px',
        },
        [theme.breakpoints.down('md')]: {
            width: '600px',
        },
        [theme.breakpoints.down('sm')]: {
            width: '360px',

        },
    },
    container: {
        width: '100%',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: theme.palette.primary.main,
        margin: '10px 0px',
        [theme.breakpoints.down('sm')]: {
            fontSize: '1.2rem',
        },
    },
    dialog: {
        maxHeight: '700px',
        padding: '0px',
    },
    dialogDate: {
        fontSize: '12px',
    },
    dialogtxt:{
        borderBottom: '1px solid #a8a8a88c',
    }
}));

const controllerStatistics = new StatisticsC();

const StatisticsV = () => {

    //======= USE CONTEXT =======
    const { user } = useContext(UserContext);
    const { esMovil } = useContext(DispositivoContext);

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //======= USE STATES =======
    const [classesStatis, setClassesStatis] = useState(null);
    const [examStatis, setExamStatis] = useState(null)
    const [openDialog, setOpenDialog] = useState(false);
    const [observations, setObservations] = useState(null);

    useEffect(() => {
        if ((!classesStatis)) {
            controllerStatistics.getStatics({ idUser: user.id })
                .then((data) => {
                    if (data.ok) {
                        console.log(data.data);
                        setExamStatis(data.data.examStart.exam)
                        setClassesStatis(data.data.staticsClass);
                        let observations = data.data.staticsClass.find(item => item.id === 'observaciones').observations;
                        console.log(observations)
                        setObservations(observations);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [])


    //funcion que abre o cierra el alert
    const handleOpenDialog = (item, accion) => {
        setOpenDialog(!openDialog);
    };

    const handlePieClick = (data, event) => {
        if (data.id === 'observaciones') {
            handleOpenDialog();
        }
    };

    //======= VISTA =======
    return (
        <EstructuraV
            render={() => (
                <Grid item className={classes.container}>
                    <Grid container>
                        <Grid item container justifyContent='center' className={classes.title}>
                            Estadísticas de examenes
                        </Grid>
                        {examStatis ? (
                            <Grid item className={classes.containerGraph}>
                                <ResponsiveBar
                                    data={examStatis}
                                    keys={[
                                        'nota maxima',
                                        'nota minima',
                                        'examenes realizados',
                                        'promedio',
                                    ]}
                                    indexBy="examen"
                                    margin={{ top: 53, right: 0, bottom: 50, left: 30 }}
                                    padding={0.35}
                                    innerPadding={1}
                                    groupMode={esMovil ? 'stacked' : 'grouped'}
                                    valueScale={{ type: 'linear' }}
                                    indexScale={{ type: 'band', round: true }}
                                    colors={{ scheme: 'nivo' }}
                                    defs={[
                                        {
                                            id: 'dots',
                                            type: 'patternDots',
                                            background: 'inherit',
                                            color: '#38bcb2',
                                            size: 4,
                                            padding: 1,
                                            stagger: true
                                        },
                                        {
                                            id: 'lines',
                                            type: 'patternLines',
                                            background: 'inherit',
                                            color: '#eed312',
                                            rotation: -45,
                                            lineWidth: 6,
                                            spacing: 10
                                        }
                                    ]}
                                    fill={[
                                        {
                                            match: {
                                                id: 'fries'
                                            },
                                            id: 'dots'
                                        },
                                        {
                                            match: {
                                                id: 'sandwich'
                                            },
                                            id: 'lines'
                                        }
                                    ]}
                                    borderColor={{
                                        from: 'color',
                                        modifiers: [
                                            [
                                                'darker',
                                                '1.3'
                                            ]
                                        ]
                                    }}
                                    theme={
                                        localStorage.getItem('mode') === 'dark' ? {
                                            axis: {
                                                ticks: {
                                                    text: {
                                                        fill: '#999' // Cambia 'blue' al color que desees
                                                    }
                                                }
                                            },
                                            tooltip: {
                                                container: {
                                                    background: '#000000', // Color de fondo del tooltip
                                                },
                                            },
                                        } : {
                                            axis: {
                                                ticks: {
                                                    text: {
                                                        fill: '#999' // Cambia 'blue' al color que desees
                                                    }
                                                }
                                            },
                                            tooltip: {
                                                container: {
                                                    background: '#FFFFFF', // Color de fondo del tooltip
                                                },
                                            },
                                        }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'Examenes',
                                        legendPosition: 'middle',
                                        legendOffset: 40,
                                        truncateTickAt: 0,
                                    }}
                                    axisLeft={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: '',
                                        legendPosition: 'middle',
                                        legendOffset: -40,
                                        truncateTickAt: 0
                                    }}
                                    labelSkipWidth={12}
                                    labelSkipHeight={12}
                                    labelTextColor={{
                                        from: 'color',
                                        modifiers: [
                                            [
                                                'darker',
                                                '1.7'
                                            ]
                                        ]
                                    }}
                                    legends={[
                                        {
                                            dataFrom: 'keys',
                                            anchor: 'top-left',
                                            direction: 'row',
                                            justify: false,
                                            translateX: -33,
                                            translateY: -44,
                                            itemsSpacing: 0,
                                            itemWidth: 95,
                                            itemTextColor: '#999',
                                            itemHeight: 16,
                                            itemDirection: 'top-to-bottom',
                                            itemOpacity: 0.85,
                                            symbolSize: 17,
                                            effects: [
                                                {
                                                    on: 'hover',
                                                    style: {
                                                        itemOpacity: 1
                                                    }
                                                }
                                            ]
                                        }
                                    ]}
                                    isInteractive={esMovil ? false : true}
                                    role="application"
                                    ariaLabel="Nivo bar chart demo"
                                    barAriaLabel={e => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
                                />
                            </Grid>
                        ) :
                            (
                                <Grid container alignContent={'center'} height='300px' justifyContent='center'>
                                    <Loading text={'Cargandos resumén de examenes'}></Loading>
                                </Grid>
                            )
                        }

                    </Grid>

                    <Grid container>
                        <Grid item container justifyContent='center' className={classes.title}>
                            Estadísticas de clases
                        </Grid>
                        {classesStatis ? (
                            <Grid item className={classes.containerGraph}>
                                <ResponsivePie
                                    data={classesStatis}
                                    onClick={handlePieClick}
                                    margin={{ top: 40, right: 0, bottom: 80, left: 20 }}
                                    innerRadius={0.5}
                                    padAngle={0.7}
                                    cornerRadius={3}
                                    activeOuterRadiusOffset={8}
                                    borderWidth={1}
                                    theme={
                                        localStorage.getItem('mode') === 'dark' ? {
                                            axis: {
                                                ticks: {
                                                    text: {
                                                        fill: '#999' // Cambia 'blue' al color que desees
                                                    }
                                                }
                                            },
                                            tooltip: {
                                                container: {
                                                    background: '#000000', // Color de fondo del tooltip
                                                },
                                            },
                                        } : {
                                            axis: {
                                                ticks: {
                                                    text: {
                                                        fill: '#999' // Cambia 'blue' al color que desees
                                                    }
                                                }
                                            },
                                            tooltip: {
                                                container: {
                                                    background: '#FFFFFF', // Color de fondo del tooltip
                                                },
                                            },
                                        }}
                                    borderColor={{
                                        from: 'color',
                                        modifiers: [
                                            [
                                                'darker',
                                                0.2
                                            ]
                                        ]
                                    }}
                                    arcLinkLabelsSkipAngle={10}
                                    arcLinkLabelsTextColor="#999"
                                    arcLinkLabelsThickness={2}
                                    arcLinkLabelsColor={{ from: 'color' }}
                                    arcLabelsSkipAngle={10}
                                    arcLabelsTextColor={{
                                        from: 'color',
                                        modifiers: [
                                            [
                                                'darker',
                                                2
                                            ]
                                        ]
                                    }}
                                    legends={[
                                        {
                                            anchor: 'bottom',
                                            direction: 'row',
                                            justify: false,
                                            translateX: -10,
                                            translateY: 56,
                                            itemsSpacing: 0,
                                            itemWidth: 90,
                                            itemHeight: 18,
                                            itemTextColor: '#999',
                                            itemDirection: 'top-to-bottom',
                                            itemOpacity: 1,
                                            symbolSize: 15,
                                            symbolShape: 'circle',
                                            effects: [
                                                {
                                                    on: 'hover',
                                                    style: {
                                                        itemTextColor: '#000'
                                                    }
                                                }
                                            ]
                                        }
                                    ]}
                                />
                                <Dialog
                                    open={openDialog}
                                    onClose={handleOpenDialog}
                                    className={classes.dialog}
                                >
                                    <DialogContent>
                                        <Grid container direction='column'>
                                            <Grid container justifyContent='center' component='h2' >
                                                Observaciones
                                            </Grid>
                                            <List >
                                                {observations && observations.map((item, key) => (
                                                    <ListItem key={key} >
                                                        <ListItemIcon className={classes.dialogDate}>
                                                            {dayjs(item.data).format('DD/MM/YY')}
                                                        </ListItemIcon>
                                                        <ListItemText
                                                        className={classes.dialogtxt}
                                                            primary={item.observation}
                                                            primaryTypographyProps={{
                                                                component: 'div', // Usar un elemento "div" para permitir saltos de línea
                                                                style: {
                                                                    whiteSpace: 'pre-line', // Establecer el comportamiento de los saltos de línea
                                                                },
                                                            }}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Grid>
                                    </DialogContent>
                                </Dialog>
                            </Grid>) : (
                            <Grid container alignContent={'center'} height='300px' justifyContent='center'>
                                <Loading text={'Cargando resumen del progreso de clases'}></Loading>
                            </Grid>
                        )}
                    </Grid>


                </Grid>
            )}
        />
    )
}

export default StatisticsV