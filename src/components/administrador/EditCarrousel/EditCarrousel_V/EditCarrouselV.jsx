import React, { useContext, useState } from 'react'

//============== COMPONENTES ==============
import { Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, InputLabel, Skeleton, TextField, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Flickity from 'react-flickity-component'
import "flickity/css/flickity.css";
import { HomeContext } from '../../../Providers/HomeContext';
import EstructuraV from '../../../estructura/EstructuraV';
import { AddCircleOutline, Delete } from '@mui/icons-material';

import EditCarrouselC from '../EditCarrousel_C/EditCarrouselC';

const {
  REACT_APP_URL_STORAGE,
} = process.env;

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
  container: {
    background: theme.background.style4,
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
    paddingBottom: '100px'
  },
  img: {
    height: '500px',
    width: '100%',
    objectFit: 'contain',
    boxShadow: '0px 2px 6px 0px rgba(0,0,0,0.75)',
    [theme.breakpoints.down('md')]: {
      height: '360px',
    },
  },
  skeleton: {
    width: '100%',
    height: 600,
    [theme.breakpoints.down('md')]: {
      height: '360px',
    },
  },

  contentItemCarrusel: {
    marginTop: '10px',
  },

  containerImg: {
    position: 'relative', // Asegura que el contenedor sea posicionado para que el icono pueda tener una posición absoluta relativa a él
  },

  iconContainer: {
    position: 'absolute',
    top: 10, // Ajusta estos valores según tu preferencia para colocar el icono en la esquina superior derecha
    right: 10,
  },

  icon: {
    fontSize: 24, // Ajusta el tamaño del icono según tus necesidades
  },
  btnReg: {
    color: 'black',
    ...theme.button,
    marginTop: '30px',
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.btn.color3,
    '&:hover': {
        backgroundColor: theme.palette.btn.color3H,  
    },
    // color: theme.palette.letters.color5,
  },
  txtDialogHeaderDelete: {
    color: theme.palette.letters.color5,
    fontWeight: 700,
    fontSize: '20px',
    lineHeight: '1.5',
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      marginLeft: theme.spacing(0),
    },
  },
  btnAcept: {
    background: theme.palette.btn.color3,
    color: theme.palette.letters.color5,
    '&:hover': {
      background: theme.palette.btn.color3H,
      color: 'white'
    },
  },
  btnCancel: {
    background: 'red',
    color: theme.palette.letters.color4,
    '&:hover': {
      background: '#660500',
      color: 'white'
    },
  },
  txtDelete: {
    color: '#660500',
    fontSize: '15px',
    lineHeight: '1.5',
    [theme.breakpoints.down('md')]: {
      fontSize: '13px',
    },
  },
  btnIcon: {
    backgroundColor: theme.palette.btn.color1,
    '&:hover': {
        backgroundColor: theme.palette.btn.color1H,  
    },
    marginRight: '10px',
  },
  txtDialogHeader: {
    color: 'black',
    fontWeight: 700,
    lineHeight: '1.5',

    marginLeft: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      marginLeft: theme.spacing(0),
    },
  },
  iconDelete:{
    color: '#FFC384',
  }
  ,
}));


//======= OPCIONES CARROUSEL (flikity) =======
const flickityOptions = {
  initialIndex: 1,
  wrapAround: true,
  pageDots: false,
  autoPlay: 5000,
  freeScroll: false,
  freeScrollFriction: 0.03,
  dragThreshold: 10,
  selectedAttraction: 0.01,
  friction: 0.15,
  contain: true,
  cellAlign: 'center',
  percentPosition: false,
  imagesLoaded: true,
  lazyLoad: true,
  pauseAutoPlayOnHover: false,
  adaptiveHeight: false,
}

const EditCarrouselV = () => {

  //======= USE STATE =======
  const [openCard, setOpenCard] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDeleteCard, setOpenDeleteCard] = useState(false);
  const [imgSelected, setImgSelected] = useState();
  const [description, setDescription] = useState('Imagen');

  //======= USE CONTEXT =======
  const { carrousel, setCarrousel, setAlert, } = useContext(HomeContext);


  //============ FUNCIONES =================

  //Funcion que maneja el cambio de archivo
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  //Funcion que abre el modal
  const handleOpenCard = (item = "") => {
    setOpenCard(!openCard);
    setDescription('Imagen');
    setSelectedFile(null)
  }

  const controllerEditCarrouselC = new EditCarrouselC();

  const handleAlertDelete = () => {
    setOpenDeleteCard(!openDeleteCard);
  };

  const handleDeleteItem = () => {
    handleAlertDelete();
    setAlert({ message: 'Eliminando Imagen...', type: 'info', status: true })
    controllerEditCarrouselC.deleteCarrouselImg(imgSelected)
      .then((resp) => {
        if (resp.ok) {
          setAlert({ message: resp.message, type: 'success', status: true })

          let carrouselNew = carrousel.filter(car => car.id !== resp.data.id);
          setCarrousel(carrouselNew);
        } else {
        }
      })
      .catch((error) => {
        setAlert({ message: 'Error al eliminar imagen', type: 'error', status: true })
      });
  }

  //Funcion que guarda los cambios
  const saveChanges = () => {
    if (selectedFile !== null) {
      setAlert({ message: '  Agregando Imagen...', type: 'info', status: true });
      controllerEditCarrouselC.saveCarrousel({selectedFile, description})
        .then((resp) => {
          if (resp.ok) {
            setAlert({ message: resp.message, type: 'success', status: true })
            setOpenCard(false);
            handleOpenCard();
            carrousel.push(resp.data);
          } else {
            setAlert({ message: resp.message, type: 'error', status: true })
          }
        })
        .catch((error) => {
          setAlert({ message: 'Error con el servidor, porfavor comuniquese con soporte', type: 'error', status: true })
        });
    } else {
      //setHelpForm('Debe completar todos los campos y agregar una imagen')
      //setError(true)
    }

  }

  //======= VARIABLE ESTILOS =======
  const classes = useStyles();

  //======= VISTA =======
  return (
    <EstructuraV
      render={() => (
        <Grid container direction="column">

          {/* Modal que verifica si quiere eliminar la imagen */}
          <Dialog
            open={openDeleteCard}
            onClose={handleAlertDelete}
            aria-labelledby="Esperando"
            aria-describedby="Esprando a cargar la pagina"
          >
            <DialogTitle id="alert-dialog-title" align="center">
              <Grid container spacing={1} justifyContent='center'>
                <Typography variant="h6" className={classes.txtDialogHeaderDelete}>
                  Esta seguro de querer eliminar el item?
                </Typography>
                <Typography variant="p" className={classes.txtDelete}>
                  Una vez eliminado no se podra recuperar la información
                </Typography>
              </Grid>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} alignItems="center" justifyContent='center'>
                <Grid item align='center'>
                  <Button
                    variant='contained'
                    className={classes.btnAcept}
                    size='small'
                    onClick={handleDeleteItem}
                  >
                    Eliminar
                  </Button>
                </Grid>
                <Grid item align='center'>
                  <Button
                    variant='contained'
                    className={classes.btnCancel}
                    size='small'
                    onClick={handleAlertDelete}
                  >
                    Cancelar
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>

          <Dialog
            open={openCard}
            onClose={handleOpenCard}
            aria-labelledby="Esperando"
            aria-describedby="Esprando a cargar la pagina"
          >
            <DialogTitle id="alert-dialog-title" align="center">
              <Grid container >
                <Grid item container justifyContent='center' xs={12}>
                  <Grid item xs={11}>
                    <Typography variant="h6" className={classes.txtDialogHeader}>
                      Agregar imágen
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent>
              <Grid container alignItems="center" justifyContent='center'>
                <Grid item xs={11} paddingBottom={3}>
                  <TextField
                    id="name"
                    color="letters"
                    label="Descripción de la imagen"
                    variant="filled"
                    fullWidth
                    //error={error}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value)
                    }}
                  />
                </Grid>
                <Grid item xs={11}>
                  <InputLabel className={classes.txtInput}>Imagen</InputLabel>
                  <input type="file" name='img' id='img' onChange={handleFileChange} className={classes.txtInput} />
                </Grid>

                <Grid item xs={12} align='center'>
                  <Button
                    variant='contained'
                    className={classes.btnReg}
                    size='small'
                    disabled={selectedFile === null}
                    onClick={() => saveChanges()}
                  >
                    Agregar Imagen
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>

          <Grid item className={classes.container} id='carrusel'>
            <Grid align="center">
              <Button
                variant='contained'
                className={classes.btnReg}
                onClick={() => handleOpenCard({ title: '', price: '', features: [], type: 'add' })}
              >
                AGREGAR IMAGÉN
                <AddCircleOutline />
              </Button>
            </Grid>
            {carrousel ? (
              <Flickity
                elementType={'div'}
                options={flickityOptions}
                disableImagesLoaded={false}
                reloadOnUpdate
              >

                {carrousel.map((item, index) => (
                  <Grid key={index} className={classes.contentItemCarrusel}>
                    <Grid className={classes.containerImg}>
                      <img src={REACT_APP_URL_STORAGE + item.url} className={classes.img} alt={item.description} />
                      <Grid align="center" item className={classes.iconContainer}>
                        <IconButton className={classes.btnIcon} onClick={() => {
                          handleAlertDelete(); // Llamada a la primera función
                          setImgSelected(item); // Llamada a la segunda función
                        }}>
                          <Delete color='letters' className={classes.iconDelete} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                ))
                }
              </Flickity>
            ) : (
              <Skeleton variant="rectangular" animation="wave" className={classes.skeleton} />
            )
            }

          </Grid>


        </Grid>
      )}
    />
  )


}

export default EditCarrouselV
