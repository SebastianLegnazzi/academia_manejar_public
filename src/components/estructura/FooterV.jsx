// import React, { useContext } from 'react';
import { Avatar, Grid, IconButton, Link, Tooltip, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {
  WhatsApp,
  Facebook,
  Instagram,
} from '@mui/icons-material';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import logoSeba from '../../utils/img/desarrolladores/Logotipo_Personal(Sebastian_Legnazzi).png'
import logoDari from '../../utils/img/desarrolladores/Logotipo_Personal(dariana_sosa).png'
import packageJson from "../../../package.json";
// import { HomeContext } from '../Providers/HomeContext';

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
  container:{
    backgroundColor: theme.palette.header.color2,
  },
  txt: {
    fontSize: '0.9rem',
    color: theme.palette.letters.color2,
    [theme.breakpoints.down('sm')]: {
      marginTop: '20px',
    },
  },
  iconFacebook: {
    backgroundColor: '#3b5998',
    width: '35px',
    height: '35px',
    transition: 'all 0.5s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1) rotate(360deg)',
    },
  },
  iconInstagram: {
    backgroundColor: '#e4405f',
    width: '35px',
    height: '35px',
    transition: 'all 0.5s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1) rotate(360deg)',
    }
  },
  iconWpp: {
    backgroundColor: '#25d366',
    width: '35px',
    height: '35px',
    transition: 'all 0.5s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1) rotate(360deg)',
    }
  },
  txtHeaderDevelop: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    letterSpacing: '0.1rem',
    color: theme.palette.letters.color2,
    [theme.breakpoints.down('md')]: {
      borderTop: '1px solid #cfcfcf',
    },
  },
  txtDevelop: {
    fontSize: '1rem',
    color: theme.palette.letters.color2,
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      color: '#FFC800',
    }
  },
  logo: {
    width: '90px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
    }
  },
  textoVersion: {
    fontSize: "0.8em",
    color: theme.palette.letters.color2,
  },
  containerCenter: {
    marginTop: '10px',
    [theme.breakpoints.down('md')]: {
      marginTop: 0,
    },
  },
  visitCounter: {
    display: 'inline-block',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
    marginTop: '10px',
    padding: '10px 25px 10px 25px',
    fontSize: '18px',
    color: '#333',
  },
  icon: {
    color: theme.palette.letters.main,
  },
  count: {
    fontWeight: 'bold',
  },
  label: {
    fontSize: '14px',
    color: '#888',
  },
  iconDariana:{
    backgroundColor: 'white',
    padding: 4,
  }
}));

const FooterV = () => {

  // const { viewCount } = useContext(HomeContext);

  //======= VARIABLE ESTILOS =======
  const classes = useStyles();

  //======= Funcion que lleva a ver la direccion a WhatsAPP =======
  const openWpp = () => {
    const whatsApp = `https://api.whatsapp.com/send?phone=5492995319130&text=Hola!%20quisiera%20consultar%20por%20los%20cursos`;
    window.open(whatsApp, '_blank');
  };

  //======= Funcion que lleva a ver la direccion a Facebook =======
  const openFace = () => {
    const facebook = `https://www.facebook.com/AcademiaManejar`;
    window.open(facebook, '_blank');
  };

  //======= Funcion que lleva a ver la direccion a Instagram =======
  const openInsta = () => {
    const instagram = `https://www.instagram.com/academiamanejar/`;
    window.open(instagram, '_blank');
  };

  //======= Funcion que lleva a ver la direccion a Sebastian =======
  const openSeba = () => {
    const seba = `https://www.linkedin.com/in/sebastian-legnazzi/`;
    window.open(seba, '_blank');
  };

  //======= Funcion que lleva a ver la direccion a Dariana =======
  const openDari = () => {
    const dari = `https://www.linkedin.com/in/dariana-sosa-3408ba200/`;
    window.open(dari, '_blank');
  };


  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid item container alignContent="center" alignItems="center" justifyContent="space-around" md={4}>
        <Grid item>
          <Typography className={classes.txt}>
            Copyright © Academia Manejar
          </Typography>
        </Grid>
        {/* <Grid item>
          <Box className={classes.visitCounter}>
            <IconButton className={classes.icon}>
              <VisibilityIcon />
            </IconButton>
            <Typography variant="body1" align='center' className={classes.count}>
              {viewCount}
            </Typography>
            <Typography variant="body2" className={classes.label}>
              Visitas
            </Typography>
          </Box>
        </Grid> */}
      </Grid>
      <Grid item container alignContent="center" justifyContent="center" className={classes.containerCenter} spacing={0} md={4}>
        <Grid item container alignContent="center" justifyContent="center" spacing={2}>
          <Grid item>
            <IconButton
              onClick={openWpp}
            >
              <Avatar className={classes.iconWpp}>
                <WhatsApp />
              </Avatar>
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              onClick={openFace}
            >
              <Avatar className={classes.iconFacebook}>
                <Facebook />
              </Avatar>
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              onClick={openInsta}
            >
              <Avatar className={classes.iconInstagram}>
                <Instagram />
              </Avatar>
            </IconButton>
          </Grid>
        </Grid>
        <Grid item>
          <Typography className={classes.textoVersion} align="center">
            Version {packageJson.version}
          </Typography>
        </Grid>
      </Grid>
      <Grid item container justifyContent="center" alignContent="center" md={4}>
        <Grid item>
          <Typography className={classes.txtHeaderDevelop}>
            DESARROLLADORES
          </Typography>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" align="center" spacing={0}>
          <Grid item>
            <Tooltip title="Sebastián Legnazzi" placement="bottom" className={classes.tooltip}>
              <IconButton
                onClick={openSeba}
              >
                <img src={logoSeba} alt="Logo Sebastian Legnazzi" className={classes.logo} />
              </IconButton>
            </Tooltip>
            {/* <Typography className={classes.txtDevelop}>
              <Link onClick={openSeba} underline="none" color="inherit">
                Sebastian Legnazzi
              </Link>
            </Typography> */}
          </Grid>
          <Grid item>
            <Tooltip title="Dariana Sosa" placement="bottom" className={classes.tooltip}>
              <IconButton
                onClick={openDari}
                className={classes.iconDariana}
              >
                <img src={logoDari} alt="Logo Sebastian Legnazzi" className={classes.logo} />
              </IconButton>
            </Tooltip>
            {/* <Typography className={classes.txtDevelop}>
              <Link onClick={openDari} underline="none" color="inherit">
                Dariana Sosa
              </Link>
            </Typography> */}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default FooterV
