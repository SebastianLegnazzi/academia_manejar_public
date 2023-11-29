import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Grid,
  Box,
  IconButton,
  Drawer,
  Divider,
  Popover,
  Button,
  Typography,
  Avatar,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logoAM from '../../utils/img/logo2.svg';
import logoAM2 from '../../utils/img/logo.svg';
import makeStyles from '@mui/styles/makeStyles';
import { AccountCircle, Menu, WhatsApp, Facebook, Instagram, Notifications } from '@mui/icons-material';
import { UserContext } from '../Providers/UserContext';
import logoSeba from '../../utils/img/desarrolladores/Logotipo_Personal(Sebastian_Legnazzi).png'
import logoDari from '../../utils/img/desarrolladores/Logotipo_Personal(dariana_sosa).png'
import { DispositivoContext } from '../Providers/Dispositivo';
import { HomeContext } from '../Providers/HomeContext';
import { Brightness4, Brightness7 } from "@mui/icons-material";
import NotificationV from '../general/Notification/Notification_V/NotificationV';

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
  logoAM: {
    // filter:'grayscale(100%) brightness(20%) contrast(200%) hue-rotate(0deg)',
    fill: 'red !important',
    // color: theme.palette.letters.color2+'!important', 
    width: '4em',
    height: '4rem',
  },
  backGround: {
    background: theme.palette.header.color2,
    color: theme.palette.common.white,
    // padding: theme.spacing(0, 2, 0, 0),
    height: '70px',
  },
  backGroundMov: {
    textAlign: 'center',
    height: '100%',
    background: theme.palette.header.color2,
  },
  linkContainer: {
    paddingRight: theme.spacing(1),
  },
  linkContainerMovile: {
    paddingTop: theme.spacing(3),
  },
  auth: {
    color: theme.palette.letters.color2,
  },
  authContainer: {

  },
  containerBtnAuth: {
    color: theme.palette.letters.color2,
    width: '100%',
    // padding: theme.spacing(1, 1),
    '&:hover': {
      background: "#96969669",
    },
  },
  linkAuh: {
    textDecoration: 'none',
    color: theme.palette.letters.color5,
  },
  txt: {
    fontSize: '0.8rem',
    color: '#b5b5b5',
  },
  iconFacebook: {
    backgroundColor: '#3b5998',
    width: '35px',
    height: '35px',
    transition: 'all 0.5s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1) rotate(360deg)',
    }
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
  containerMovil: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    padding: theme.spacing(2, 2),
  },
  containerIcons: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'text.primary',
    p: 3,
  },
  txtHeaderDevelop: {
    fontSize: '1rem',
    color: '#b5b5b5',
  },
  txtDevelop: {
    textDecoration: 'none',
    fontSize: '0.8rem',
    color: '#b5b5b5',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      color: '#FFC800',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.6rem',
    },
  },
  logo: {
    width: '60px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    color: theme.palette.letters.color1,
  },
  link: {
    color: theme.palette.letters.color2,
  },
  labelSelect: {
    color: theme.palette.letters.color2,
    fontSize: '0.8rem',
  },
  inputSelect: {
    // backgroundColor: 'white',
    height: '35px',
  },
  containerMenu: {
    marginTop: '10px',
  },
  iconoMenu: {
    width: '50px !important',
    height: '40px !important',
    transform: 'scale(1.3)',
    padding: '9px',
    fill: theme.palette.letters.color2,
  },
  iconMovilMenu: {
    color: theme.palette.letters.color2,
  },
  iconMood: {
    color: theme.palette.letters.color2,
  },
  popover: {
    maxHeight: '500px', 
    left: '-30px',
    [theme.breakpoints.down('md')]: {
      left: '0px',
      top: '-10px',
      maxHeight: '280px',
    },
  },
}));


//============== APP BAR MUI ==============
const drawerWidth = 240;

//==== Constante que tiene elementos de la barra de navegacion ====
const navItems = [
  { name: 'INICIO', href: 'inicio', type: 1 },
  { name: 'FLOTA', href: 'carrusel', type: 1 },
  { name: 'CURSOS', href: 'curses', type: 1 },
  { name: 'NOSOTROS', href: 'us', type: 1 },
  { name: 'CONTACTO', href: 'contact', type: 1 },
  // { name: 'VIDEOS', href: 'videos', type: 2 },
];

const HeaderV = (props) => {

  //======= CONTEXTOS =======
  const { cerrarSesion, menues, user } = useContext(UserContext);
  const { esMovil } = useContext(DispositivoContext);
  const { mode, setMode } = useContext(HomeContext);

  const navigate = useNavigate();

  //======= VARIABLE ESTILOS =======
  const classes = useStyles();

  //======= FUNCIONES =======
  const checkPath = (id, type) => {
    if (type === 1) {
      navigate('/');
      // Esperar un breve tiempo antes de desplazarse para que el componente se cargue completamente después de la redirección
      setTimeout(() => {
        scrollToSection(id)
      }, 100); // Puedes ajustar este tiempo según sea necesario
    } else {
      navigate('/' + id)
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  //======= ACCION QUE ABRE APPBAR =======
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNoti, setAnchorElNoti] = useState(null);
  const [menu, setMenu] = useState(localStorage.getItem('menuIndex') ? parseInt(localStorage.getItem('menuIndex')) : 0);
  const [openSelect, setOpenSelect] = useState(false);

  const handleOpenClose = () => {
    setOpenSelect(!openSelect);
  };

  const handleClickMov = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickNoti = (event) => {
    setAnchorElNoti(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseNoti = () => {
    setAnchorElNoti(null);
  };

  const open = Boolean(anchorEl);
  const openNoti = Boolean(anchorElNoti);
  const id = open ? 'menu' : undefined;
  const idNoti = openNoti ? 'notificacion' : undefined;
  const whatsApp = `https://api.whatsapp.com/send?phone=5492995319130&text=Hola!%20quisiera%20consultar%20por%20los%20cursos`;
  const facebook = `https://www.facebook.com/AcademiaManejar`;
  const instagram = `https://www.instagram.com/academiamanejar/`;
  const seba = `https://www.linkedin.com/in/sebastian-legnazzi/`;
  const dari = `https://www.linkedin.com/in/dariana-sosa-3408ba200/`;

  const changeMode = () => {
    mode === 'light' ? setMode('dark') : setMode('light');
  };

  const redirectUrl = (url) => {
    navigate(url)
  };

  const DarkMode = (
    <Box className={classes.containerIcons}>
      <IconButton className={classes.iconMood} sx={{ ml: 1 }} onClick={changeMode} color="inherit">
        {mode === 'light' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Box>
  );

  const Nav = (
    menues ? (
      /* Si esta logueado muestro menues */
      <Grid item container justifyContent='center' alignItems='center' alignContent='center'>
        <Grid container justifyContent='center' alignItems='center' alignContent='center' className={classes.containerMenu}>
          <Grid item>
            <FormControl fullWidth>
              <Box className={classes.containerIcons}>
                <IconButton aria-describedby={idNoti} variant="contained" onClick={handleClickNoti}>
                  <Notifications className={classes.iconMood} />
                </IconButton>
              </Box>
              <Popover
                id={idNoti}
                open={openNoti}
                anchorEl={anchorElNoti}
                onClose={handleCloseNoti}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                className={classes.popover}
              >
                <NotificationV />
              </Popover>
            </FormControl >
          </Grid>

          <Grid item>
            {DarkMode}
          </Grid>

          <Grid item >
            {menues && menu !== null &&
              <FormControl fullWidth>
                <Box className={classes.containerIcons}>
                  <IconButton aria-describedby={id} variant="contained" onClick={handleClickMov}>
                    <Grid className={classes.iconoMenu} dangerouslySetInnerHTML={{ __html: menues[menu].icono }} />
                  </IconButton>
                </Box>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <Grid item container direction='column'>
                    {menues[menu].routes.map((ruta, index) => (
                      <Grid item key={index}>
                        <Button onClick={() => redirectUrl(ruta.url)} className={classes.containerBtnAuth}>
                          {ruta.name}
                        </Button>
                      </Grid>
                    ))
                    }
                    <Button onClick={cerrarSesion} className={classes.containerBtnAuth}>
                      Cerrar Sesion
                    </Button>
                  </Grid>
                </Popover>
              </FormControl >
            }
          </Grid>
          {user && user.roleIds.split("#").length > 1 &&
            <Grid item>
              <Grid container direction='column'>
                <InputLabel id="menu-select" className={classes.labelSelect}>Rol</InputLabel>
                <Select
                  labelId="menu-select"
                  id="menu-select"
                  open={openSelect}
                  onClose={handleOpenClose}
                  onOpen={handleOpenClose}
                  value={menu}
                  onChange={(e) => {
                    localStorage.setItem('menuIndex', e.target.value)
                    setMenu(e.target.value)
                  }}
                  className={classes.inputSelect}
                >
                  {menues.map((menu, index) =>
                    <MenuItem key={index} value={index}>{menu.rolName}</MenuItem>
                  )}
                </Select>
              </Grid>
            </Grid>
          }
        </Grid>
      </Grid>
    ) : (
      /* Si no esta logueado muestro pordefecto */
      <Grid container>
        <Grid item>
          {DarkMode}
        </Grid>
        <Grid item>
          <Box className={classes.containerIcons}>
            <IconButton aria-describedby={id} variant="contained" className={classes.authContainer} onClick={handleClickMov}>
              <AccountCircle className={classes.auth} />
            </IconButton>
          </Box>
        </Grid>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Grid container direction='column'>
            <Grid item>
              <Button className={classes.containerBtnAuth}>
                <Link to="/login" className={classes.linkAuh}>
                  Ingresar
                </Link>
              </Button>
            </Grid>
            <Grid item>
              <Button className={classes.containerBtnAuth}>
                <Link to="/register" className={classes.linkAuh}>
                  Registrarse
                </Link>
              </Button>
            </Grid>
            <Grid item>
              <Button className={classes.containerBtnAuth}>
                <Link to="/exam" className={classes.linkAuh}>
                  Examen
                </Link>
              </Button>
            </Grid>
          </Grid>
        </Popover>
      </Grid>
    )
  );

  //======= HEADER MOVIL =======
  const drawer = (
    <Box className={classes.backGroundMov}>
      <Grid>
        <img src={mode === 'light' ? logoAM : logoAM2} alt="Logo academia manejar" className={classes.logoAM} />
      </Grid>
      <Divider />
      <Grid container direction="column" spacing={2} className={classes.linkContainerMovile} >
        {navItems.map((item, index) => (
          <Grid onClick={handleDrawerToggle} item key={index}>
            <Button onClick={() => checkPath(item.href, item.type)} className={classes.link}>
              {item.name}
            </Button>
          </Grid>
        ))}
        <Grid item container justifyContent='space-evenly'>
          {Nav}
          <Grid item container className={classes.containerMovil}>
            <Grid item container spacing={2}>
              <Grid item container alignContent="center" justifyContent="center" lg={4}>
                <Typography className={classes.txt}>
                  Copyright © Academia Manejar
                </Typography>
              </Grid>
              <Grid item container alignContent="center" justifyContent="center" spacing={2} >
                <Grid item>
                  <Link to={whatsApp} target="_blank">
                    <Avatar className={classes.iconWpp}>
                      <WhatsApp />
                    </Avatar>
                  </Link>
                </Grid>
                <Grid item>
                  <Link to={facebook} target="_blank">
                    <Avatar className={classes.iconFacebook}>
                      <Facebook />
                    </Avatar>
                  </Link>
                </Grid>
                <Grid item>
                  <Link to={instagram} target="_blank">
                    <Avatar className={classes.iconInstagram}>
                      <Instagram />
                    </Avatar>
                  </Link>
                </Grid>
                <Grid item container justifyContent="center" lg={4}>
                  <Grid item>
                    <Typography className={classes.txtHeaderDevelop}>
                      Desarrolladores
                    </Typography>
                  </Grid>
                  <Grid item container justifyContent="center" alignItems="center" align="center" spacing={2}>
                    <Grid item xs={6}>
                      <Link
                        to={seba}
                      >
                        <img src={logoSeba} alt="Logo Sebastian Legnazzi" className={classes.logo} />
                      </Link>
                      <Typography>
                        <Link to={seba} underline="none" color="inherit" className={classes.txtDevelop}>
                          Sebastian Legnazzi
                        </Link>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Link
                        to={dari}
                      >
                        <img src={logoDari} alt="Logo Sebastian Legnazzi" className={classes.logo} />
                      </Link>
                      <Typography>
                        <Link to={dari} underline="none" color="inherit" className={classes.txtDevelop}>
                          Dariana Sosa
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box >
  );

  //======= HEADER DESKTOP =======
  const container = window !== undefined ? () => window().document.body : undefined;
  return (
    <Box>
      <CssBaseline />
      <AppBar component="nav" className={classes.backGround}>
        <Toolbar>
          <Grid container justifyContent="space-between" alignContent="center" alignItems='center'>
            <IconButton
              className={classes.iconMovilMenu}
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { lg: 'none' } }}
            >
              <Menu />
            </IconButton>
            <Grid item xs={2}>
              <img className={classes.logoAM} src={mode === 'light' ? logoAM : logoAM2} alt="Logo academia manejar" />
            </Grid>
            <Grid xs={6} item container spacing={3} justifyContent="center" alignItems="center" className={classes.linkContainer} sx={{ display: { xs: 'none', lg: 'flex' } }}>
              {navItems.map((item, index) => (
                <Grid item key={index}>
                  <Button onClick={() => checkPath(item.href, item.type)} className={classes.link}>
                    {item.name}
                  </Button>
                </Grid>
              ))}
            </Grid>
            <Grid item>
              {!esMovil &&
                Nav
              }
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {
        esMovil &&
        <>
          <Box component="nav">
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { lg: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
          <Toolbar />
        </>
      }
    </Box >
  );
}

export default HeaderV
