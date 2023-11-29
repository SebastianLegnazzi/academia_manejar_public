import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import EstructuraV from '../estructura/EstructuraV';
// import makeStyles from '@mui/styles/makeStyles';
import { Navigate, useNavigate } from 'react-router-dom';
import Loading from '../estructura/Loading';

//============== ESTILOS MUI ==============
// const useStyles = makeStyles((theme) => ({
//   txt: {
//     color: 'red',
//     marginTop: '30px',
//   },
// }));

const Error404V = () => {
  //======= VARIABLE ESTILOS =======
  // const classes = useStyles();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Almacena el valor actual de navigate en la referencia

    if (!localStorage.getItem('token')) {
      navigate('/')
    }

    setTimeout(() => {
      setLoading(false);
    }, 10000);
  }, [navigate]);

  //======= VISTA =======
  return (
    <EstructuraV
      render={() => (
        <Grid container justifyContent='center' alignItems='center' alignContent='center' direction='column'>
          {loading ? (
            <Loading text={'Cargando pagina...'} />
          ) : (
            // <>
            //   <Grid item>
            //     <Typography variant='h6' className={classes.txt}>Pagina No encontrada!</Typography>
            //   </Grid>
            //   <Grid item>
            //     <Button>
            //       <Link to='/' style={{ textDecoration: 'none' }}>
            //         Volver al inicio
            //       </Link>
            //     </Button>
            //   </Grid>
            // </>
            <Navigate push to="/login"/>
          )
          }
        </Grid>
      )}
    />
  )
}

export default Error404V
