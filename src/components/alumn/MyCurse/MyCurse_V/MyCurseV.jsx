import React, { useContext, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import EstructuraV from '../../../estructura/EstructuraV';
import { UserContext } from '../../../Providers/UserContext';
import MyCurseC from '../MyCurse_C/MyCurseC';
import { HomeContext } from '../../../Providers/HomeContext';
import { Button, Card, CardActionArea, CardContent, CardMedia, Grid, Paper, Typography } from '@mui/material';
import Loading from '../../../estructura/Loading';
import dayjs from 'dayjs';
import { Refresh } from '@mui/icons-material';

//============== COMPONENTES ==============
const {
  REACT_APP_URL_STORAGE,
} = process.env;


const useStyles = makeStyles((theme) => ({
  container: {
    padding: '10px 5px',
  },
  CardContainer: {
    width: 500,
    [theme.breakpoints.down('sm')]: {
      width: 300,
    },
  },
}));

const controllerMcurse = new MyCurseC();

const MyCurseV = () => {

  //======= USE CONTEXT =======
  const { setCourses, courses, user } = useContext(UserContext);
  const { setOpenModal, setAlert } = useContext(HomeContext);
  //======= VARIABLE ESTILOS =======
  const classes = useStyles();

  useEffect(() => {
    if (!courses) {
      //Funcion que carga todos los cursos
      controllerMcurse.getMyCourse(user.id)
        .then((res) => {
          console.log(res);
          if (res.ok) {
            setCourses(res.data);
          } else {
            setAlert({ message: res.message, type: 'error', status: true })
          }
        }).catch((err) => {
          setOpenModal({ open: false })
          setAlert({ message: 'Error con el servidor, por favor intentelo mas tarde', type: 'error', status: true })
        });
    }
  }, [setCourses, courses])

  //======= VISTA =======
  return (
    <EstructuraV
      render={() => (
        <Grid container spacing={1} justifyContent='space-evenly' className={classes.container}>
          <Grid item xs={12}>
            <Typography variant='h4' component='div' align='center'>
              Mis Cursos
            </Typography>
          </Grid>
          {courses ? (
            <>
              <Grid item align='center' xs={12}>
                <Button onClick={() => setCourses(null)} variant='h4' component='div' align='center'>
                  Actualizar <Refresh />
                </Button>
              </Grid>
              {courses.map((course, i) => (
                <Grid item key={i}>
                  <Paper elevation={6}>
                    <Card className={classes.CardContainer}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image={REACT_APP_URL_STORAGE + course.urlImgCourse}
                          alt="green iguana"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" align='center' component="div">
                            {course.titleCourse}
                          </Typography>
                          <Typography variant="p" component="div" color="text.secondary">
                            <strong>Fecha de inicio:</strong> {dayjs(course.dateTurnIni).format('DD/MM/YYYY hh:mm:ss')}
                          </Typography>
                          <Typography variant="p" component="div" marginTop={1} color="text.secondary">
                            <strong>Fecha de Fin:</strong> {dayjs(course.dateTurnEnd).format('DD/MM/YYYY hh:mm:ss')}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Paper >
                </Grid>
              ))}
            </>
          ) : (
            <Loading text='Buscando Cursos' />
          )
          }
        </Grid>
      )}
    />
  )
}

export default MyCurseV
