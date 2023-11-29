import React, { useContext, useEffect } from 'react'

//============== COMPONENTES ==============
import { Avatar, Card, CardActionArea, CardContent, CardMedia, Grid, Paper, Skeleton, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import "flickity/css/flickity.css";
import { HomeContext } from '../../../Providers/HomeContext';
import CalendarC from '../Calendar_C/CalendarC';
import { CalendarContext } from '../../../Providers/CalendarContext';
import Loading from '../../../estructura/Loading';

const {
  REACT_APP_URL_STORAGE,
} = process.env;

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
  container: {
    padding: '30px 50px 0px 50px'
  },
  capitalizeText: {
    textTransform: 'capitalize',
  },
  card: {
    borderRadius: '10px',
    boxShadow: '0px 2px 10px 0px rgba(0,0,0,0.75)',
    [theme.breakpoints.down('md')]: {
      height: '360px',
    },
    '&:hover': {
      boxShadow: '0px 0px 12px #e8a259', // Sombra
    },
  },
  skeleton: {
    marginTop: '20px',
    width: 300,
    height: 150,
  },
  txtInstruct: {
    color: theme.palette.letters.color5,
    // backgroundColor: 'white',
    borderRadius: '30px',
    padding: '4px 8px',
    fontSize: '15px',
    lineHeight: '1.2',
    [theme.breakpoints.down('md')]: {
      fontSize: '13px',
    },
  },
  selected: {
    boxShadow: '0px 0px 12px #e8a259', // Sombra
  }
}));

const InstructoresV = () => {

  //======= VARIABLE ESTILOS =======
  const classes = useStyles();

  //======= USE STATE =======
  const { instructsCars,
    setInstructsCars,
    horario,
    instructCarSelected,
    setInstructCarSelected,
    setLoading
  } = useContext(CalendarContext);

  //======= USE CONTEXT =======
  const { setAlert } = useContext(HomeContext);

  //============ FUNCIONES =================
  const controllerCalendar = new CalendarC();

  useEffect(() => {
    if (instructCarSelected) {
      setLoading(false);
    }
    if (!instructsCars) {
      setLoading(true);
      controllerCalendar.getCar(horario)
        .then((resp) => {
          if (resp.ok) {
            setInstructCarSelected(resp.data[0])
            setInstructsCars(resp.data);
            setLoading(false);
          } else {
            setAlert({ message: resp.message, type: 'error', status: true })
          }
        })
        .catch((error) => {
          setAlert({ message: 'Error con el servidor, porfavor comuniquese con soporte', type: 'error', status: true, error })
        });
    }
  }, []);

  const handleSelectedImg = (item) => {
    setInstructCarSelected(item)
  }

  //======= VISTA =======
  return (
    <Grid item container spacing={3} className={classes.container} id='carrusel'>
      {/* <Grid item component='h1'> Turno a la {} </Grid> */}
      {instructsCars ? (
        <>
          {instructsCars.map((item, index) => {
            if (item.idInstrTime) {
              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper elevation={6}>
                    <Card className={`${classes.card} ${instructCarSelected.idCar === item.idCar ? classes.selected : ''}`}
                      onClick={() => handleSelectedImg(item)}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image={REACT_APP_URL_STORAGE + item.imgCar}
                          alt={item.description}
                        />
                        <CardContent>
                          <Grid container justifyContent='space-around' >
                            <Grid item align='center'>
                              <Typography className={classes.capitalizeText} gutterBottom variant="h5" align='center' component="div">
                                Auto
                              </Typography>
                              <Typography className={classes.capitalizeText} variant="p" component="div" color="text.secondary">
                                {item.model}
                              </Typography>
                            </Grid>
                            <Grid item align='center'>
                              <Typography className={classes.capitalizeText} gutterBottom variant="h5" align='center' component="div">
                                Instructor
                              </Typography>
                              <Typography className={classes.capitalizeText} variant="p" component="div" color="text.secondary">
                                {item.name} {item.lastname}
                              </Typography>
                              <Avatar alt="Avatar" src={REACT_APP_URL_STORAGE + item.imgInstr} />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Paper>
                </Grid>)
            }
          })}
        </>
      ) : (
        <Grid container justifyContent='center'>
          <Typography variant="h6" className={classes.txtInstruct}>
            <Loading text='Cargando Instructores' />
          </Typography>
          <Grid container justifyContent='center' spacing={2}>
            <Grid item>
              <Skeleton variant="rectangular" animation="wave" className={classes.skeleton} />
            </Grid>
            <Grid item>
              <Skeleton variant="rectangular" animation="wave" className={classes.skeleton} />
            </Grid>
            <Grid item>
              <Skeleton variant="rectangular" animation="wave" className={classes.skeleton} />
            </Grid>
          </Grid>
        </Grid>
      )}

    </Grid>

  )
}

export default InstructoresV