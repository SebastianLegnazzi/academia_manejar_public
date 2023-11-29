import React, { useContext, useEffect, useState } from 'react';
import { Grid, IconButton, Paper, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import NotificationC from '../Notification_C/NotificationC';
import { UserContext } from '../../../Providers/UserContext';
import Loading from '../../../estructura/Loading';
import { Close, CircleNotifications } from '@mui/icons-material';
import dayjs from 'dayjs';

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#fff',
    color: '#000',
    padding: '5px 10px',
  },
  containerNoti: {
    width: '300px',
  },
  title: {
    color: theme.palette.letters.color3,
    fontWeight: 'bold',
  },
  txtNoti: {
    margin: '0px 5px',
    borderBottom: '1px solid #d9d9d9',
    overflow: 'auto',
  },
  iconMovilMenu: {
    color: theme.palette.letters.color1,
    marginLeft: '1px',
  },
  iconNoti: {
    color: '#595959'
  },
  txtTime: {
    fontSize: '12px',
    color: '#ababab'
  },
}));

const controllerNoti = new NotificationC();

const NotificationV = () => {
  //======= VARIABLE ESTILOS =======
  const classes = useStyles();
  const { user } = useContext(UserContext);
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    console.log('noti')
    console.log(user)
    controllerNoti.getNoti({ userId: user.id }).then((res) => {
      console.log(res)
      setNotification(res.data)
    })
  }, [])

  const handleDelete = (id) => {
    setNotification(null)
    controllerNoti.deleteNoti({ notiId: id, userId: user.id }).then((res) => {
      console.log(res)
      setNotification(res.data)
    })
  }

  //======= VISTA =======
  return (
    <Paper elevation={6} className={classes.container}>
      <Typography className={classes.title}>
        Notificaciones
      </Typography>
      <Grid container>
        <Grid item >
          {notification && notification.length > 0 ? (
            notification.map((noti, index) => (
              <Grid key={index} container alignItems='center' className={classes.containerNoti}>
                <Grid item xs={2}>
                  <CircleNotifications className={classes.iconNoti} />
                </Grid>
                <Grid item xs={8} className={classes.txtNoti}>
                  <Grid item>
                    <div dangerouslySetInnerHTML={{ __html: noti.message }} />
                  </Grid>
                  <Grid item className={classes.txtTime}>
                    {dayjs(noti.created_at).format('DD/MM/YYYY HH:mm')}
                  </Grid>
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    className={classes.iconMovilMenu}
                    color="inherit"
                    aria-label="open drawer"
                    onClick={() => handleDelete(noti.id)}
                    edge="start"
                  >
                    <Close />
                  </IconButton>
                </Grid>
              </Grid>
            ))
          ) : notification ? (
            <Typography className={classes.txt}>
              No tienes notificaciones
            </Typography>
          ) : (
            <Loading text='Buscando notificaciones' />
          )

          }

        </Grid >
      </Grid>
    </Paper >
  )
}

export default NotificationV
