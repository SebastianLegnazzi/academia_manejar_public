import React, { useContext, useEffect, useState } from 'react'

//============== COMPONENTES ==============
import { Avatar, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, InputLabel, MenuItem, Select, Skeleton, TextField, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Flickity from 'react-flickity-component'
import "flickity/css/flickity.css";
import { HomeContext } from '../../../Providers/HomeContext';
import EstructuraV from '../../../estructura/EstructuraV';
import { AddCircleOutline, Delete, Edit } from '@mui/icons-material';
import EditcarC from '../EditCar_C/EditCarC';
import { useFormik } from 'formik';

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
    zIndex: 1000,
    top: 10, // Ajusta estos valores según tu preferencia para colocar el icono en la esquina superior derecha
    right: 10,
  },
  contanedorModelo: {
    position: 'absolute',
    bottom: 10,
    left: '40%',
  },
  tarjetaModelo: {
    padding: '10px',
    borderRadius: '30px',
    background: 'white',
  },
  txtModelo: {
    color: 'black',
    fontWeight: 700,
    fontSize: '20px',
    lineHeight: '1.5',
    [theme.breakpoints.down('md')]: {
      fontSize: '13px',
    },
  },
  avatarInstruct: {
    position: 'absolute',
    zIndex: 1000,
    top: 10, // Ajusta estos valores según tu preferencia para colocar el icono en la esquina superior derecha
    left: 10,
  },
  icon: {
    fontSize: 24, // Ajusta el tamaño del icono según tus necesidades
  },
  btnReg: {
    ...theme.button,
    marginTop: '30px',
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.btn.color3,
    '&:hover': {
      backgroundColor: theme.palette.btn.color3H,
    },
    color: 'black',
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
  iconDelete: {
    color: '#FFC384',
  },
  txtHorario: {
    color: 'black',
    fontWeight: 700,
    fontSize: '15px',
    lineHeight: '1.2',
    backgroundColor: 'white',
    borderRadius: '30px',
    padding: '0px 8px',
    [theme.breakpoints.down('md')]: {
      fontSize: '13px',
    },
  },
  txtInstruct: {
    color: 'black',
    backgroundColor: 'white',
    borderRadius: '30px',
    padding: '0px 8px',
    marginTop: '4px',
    fontSize: '15px',
    lineHeight: '1.2',
    [theme.breakpoints.down('md')]: {
      fontSize: '13px',
    },
  },
}));


//======= OPCIONES car (flikity) =======
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

const controllerEditCar = new EditcarC();

const EditCarV = () => {

  //======= USE STATE =======
  const [openCard, setOpenCard] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDeleteCard, setOpenDeleteCard] = useState(false);
  const [carSelected, setCarSelected] = useState(null);
  const [description, setDescription] = useState('Imagen');
  const [model, setModel] = useState('');
  const [data, setData] = useState(null);
  const [instructorM, setInstructorM] = useState('');
  const [instructorT, setInstructorT] = useState('');
  const [instructorSelectM, setInstructorSelectM] = useState(-1);
  const [instructorSelectT, setInstructorSelectT] = useState(-1);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(false);
  //======= USE CONTEXT =======
  const { setAlert } = useContext(HomeContext);


  //============ FUNCIONES =================

  useEffect(() => {
    console.log('se ejecuto')
    if (!data && !instructorM && !instructorT) {
      //Obtengo vehiculos
      controllerEditCar.getCar()
        .then((resp) => {
          if (resp.ok) {
            console.log(resp.data)
            setData(resp.data);
          } else {
            setAlert({ message: resp.message, type: 'error', status: true })
          }
        })
        .catch((error) => {
          setAlert({ message: 'Error con el servidor, porfavor comuniquese con soporte', type: 'error', status: true })
        });
      //Obtengo instructores para los SELECT
      controllerEditCar.getInstructTimestamp()
        .then((resp) => {
          if (resp.ok) {
            console.log(resp.data)
            setInstructorM(resp.data.morningInstr)
            setInstructorT(resp.data.afternoonInstr)
          } else {
            setAlert({ message: resp.message, type: 'error', status: true })
          }
        })
        .catch((error) => {
          setAlert({ message: 'Error con el servidor, porfavor comuniquese con soporte', type: 'error', status: true })
        });
    }
  }, [])

  //Funcion que maneja el cambio de archivo
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  //Funcion que abre el modal
  const handleOpenCard = (edit) => {
    if (edit && edit.idCar) {
      setEdit(true);
      formik.values.model = edit.model
      formik.values.description = edit.descriptionImg
      formik.values.selectInstM = edit.idUsuarioM ? edit.idUsuarioM : -1
      formik.values.selectInstT = edit.idUsuarioT ? edit.idUsuarioT : -1
    } else {
      formik.values.model = ''
      formik.values.description = ''
      formik.values.selectInstT = -1
      formik.values.selectInstM = -1
    }
    setOpenCard(!openCard);
    setSelectedFile(null)
  }

  const controllerEditCarC = new EditcarC();

  const handleAlertDelete = () => {
    setOpenDeleteCard(!openDeleteCard);
  };

  const handleDeleteItem = () => {
    handleAlertDelete();
    setAlert({ message: 'Eliminando Vehiculo...', type: 'info', status: true })
    controllerEditCarC.deleteCar(carSelected)
      .then((resp) => {
        if (resp.ok) {
          console.log(resp)
          setAlert({ message: resp.message, type: 'success', status: true })
          setData(resp.data.cars);
          setInstructorM(resp.data.instructTime.morningInstr)
          setInstructorT(resp.data.instructTime.afternoonInstr)
        } else {
        }
      })
      .catch((error) => {
        setAlert({ message: 'Error al eliminar imagen', type: 'error', status: true })
      });
  }

  //Funcion que guarda los cambios
  const saveChanges = () => {
    if (selectedFile && instructorSelectM && instructorSelectT && description && model) {
      setAlert({ message: '  Agregando Vehiculo...', type: 'info', status: true });
      controllerEditCarC.saveCar({ selectedFile, description, model, instructorSelectM, instructorSelectT })
        .then((resp) => {
          if (resp.ok) {
            console.log(resp)
            setAlert({ message: resp.message, type: 'success', status: true })
            setData(resp.data.cars);
            setInstructorM(resp.data.instructTime.morningInstr)
            setInstructorT(resp.data.instructTime.afternoonInstr)
            setOpenCard(false);
          } else {
            setAlert({ message: resp.message, type: 'error', status: true })
          }
        })
        .catch((error) => {
          setAlert({ message: 'Error con el servidor, porfavor comuniquese con soporte', type: 'error', status: true })
        });
    }
  }
  //Funcion que guarda los cambios
  const editChanges = () => {
    setAlert({ message: 'Editando Vehiculo...', type: 'info', status: true });
    console.log(carSelected)
    controllerEditCarC.editCar({ selectedFile, description, model, instructorSelectM, instructorSelectT, idCar: carSelected.idCar, idUrlData: carSelected.idUrlData })
      .then((resp) => {
        if (resp.ok) {
          console.log(resp)
          setAlert({ message: resp.message, type: 'success', status: true })
          setOpenCard(false);
          setData(resp.data.cars);
          setInstructorM(resp.data.instructTime.morningInstr)
          setInstructorT(resp.data.instructTime.afternoonInstr)
          setOpenCard(false);
        } else {
          setAlert({ message: resp.message, type: 'error', status: true })
        }
      })
      .catch((error) => {
        setAlert({ message: 'Error con el servidor, porfavor comuniquese con soporte', type: 'error', status: true })
      });
  }

  //============================= FORMIK =================================
  const validate = values => {
    const errors = {};

    if (!values.model) {
      errors.model = 'Campo Obligatorio';
    }

    if (!values.description) {
      errors.description = 'Campo Obligatorio';
    }

    if (values.selectInstM === -1 && values.selectInstT === -1) {
      errors.selectInstM = 'Campo Obligatorio';
    }

    if (values.selectInstT === -1 && values.selectInstM === -1) {
      errors.selectInstT = 'Campo Obligatorio';
    }

    if (Object.keys(errors).length === 0) {
      setError(false)
      setModel(values.model)
      setDescription(values.description)
      setInstructorSelectM(values.selectInstM)
      setInstructorSelectT(values.selectInstT)
    } else {
      setError(true)
    }

    return errors;
  };
  const formik = useFormik({
    initialValues: {
      model: '',
      description: '',
      selectInstM: -1,
      selectInstT: -1,
    },
    validate
  });

  //Funcion que maneja el cambio de instructor
  const handleinstructMSelect = (objInstr) => {
    setInstructorSelectM(objInstr);
  }

  //Funcion que maneja el cambio de instructor
  const handleinstructTSelect = (objInstr) => {
    setInstructorSelectT(objInstr);
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
                    {edit ? (
                      <Typography variant="h6" className={classes.txtDialogHeader}>
                        Editar imágen
                      </Typography>
                    ) : (
                      <Typography variant="h6" className={classes.txtDialogHeader}>
                        Agregar imágen
                      </Typography>
                    )
                    }
                  </Grid>
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent>
              <Grid container alignItems="center" spacing={2} justifyContent='center'>
                <Grid item xs={6}>
                  <TextField
                    id="model"
                    color="letters"
                    label="Modelo"
                    variant="filled"
                    fullWidth
                    error={formik.errors.model && formik.touched.model}
                    value={formik.values.model}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText={formik.errors.model && formik.touched.model ? formik.errors.model : null}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="description"
                    color="letters"
                    label="Descripción de la imagen"
                    variant="filled"
                    fullWidth
                    error={formik.errors.description && formik.touched.description}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText={formik.errors.description && formik.touched.description ? formik.errors.description : null}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel className={classes.txtInput}>Instructor de Mañana</InputLabel>
                  <Select
                    name="selectInstM" // Agrega el atributo name
                    labelId="instructorM-select"
                    id="instructorM-select"
                    fullWidth
                    className={classes.inputInstr}
                    // value={instructorSelectM}
                    // onChange={(e) => handleinstructMSelect(e.target.value)}
                    error={formik.errors.selectInstM && formik.touched.selectInstM}
                    value={formik.values.selectInstM}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value={-1}>Sin instructor</MenuItem>
                    {instructorM && instructorM.map((item, index) => (
                      <MenuItem key={index} value={item.idUsuario}>{item.name}</MenuItem>
                    ))}

                  </Select>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel className={classes.txtInput}>Instructor de Tarde</InputLabel>
                  <Select
                    name="selectInstT" // Agrega el atributo name
                    labelId="instructorT-select"
                    id="instructorT-select"
                    fullWidth
                    className={classes.inputInstr}
                    // value={instructorSelectT}
                    // onChange={(e) => handleinstructTSelect(e.target.value)}
                    error={formik.errors.selectInstT && formik.touched.selectInstT}
                    value={formik.values.selectInstT}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value={-1}>Sin instructor</MenuItem>
                    {instructorT && instructorT.map((item, index) => (
                      <MenuItem key={index} value={item.idUsuario}>{item.name}</MenuItem>
                    ))}

                  </Select>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel className={classes.txtInput}>Imagen</InputLabel>
                  <input
                    type="file"
                    name='img'
                    id='img'
                    onChange={handleFileChange}
                    className={classes.txtInput}
                    accept=".jpg, .jpeg, .png, .gif"
                  />
                </Grid>

                <Grid item xs={12} align='center'>
                  <Button
                    variant='contained'
                    className={classes.btnReg}
                    size='small'
                    disabled={error}
                    onClick={edit ? editChanges : saveChanges}
                  >
                    {edit ? 'Editar Vehículo' : 'Agregar Vehículo'}
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
                onClick={() => {
                  setEdit(false);
                  handleOpenCard();
                }}>
                AGREGAR VEHÍCULO
                <AddCircleOutline color='white' />
              </Button>
            </Grid>
            {data ? (
              <Flickity
                elementType={'div'}
                options={flickityOptions}
                disableImagesLoaded={false}
                reloadOnUpdate
              >

                {data.map((item, index) => (
                  <Grid key={index} className={classes.contentItemCarrusel}>
                    <Grid align="center" item container spacing={1} className={classes.avatarInstruct}>
                      {item.nameM &&
                        <Grid item>
                          <Typography variant="h6" className={classes.txtHorario}>
                            Turno mañana
                          </Typography>
                          <Avatar alt="Avatar" src={REACT_APP_URL_STORAGE + item.imgInstrM} />
                          <Typography variant="h6" className={classes.txtInstruct}>
                            {item.nameM} {item.lastnameM}
                          </Typography>
                        </Grid>
                      }
                      {item.nameT &&
                        <Grid item>
                          <Typography variant="h6" className={classes.txtHorario}>
                            Turno Tarde
                          </Typography>
                          <Avatar alt="Avatar" src={REACT_APP_URL_STORAGE + item.imgInstrT} />
                          <Typography variant="h6" className={classes.txtInstruct}>
                            {item.nameT} {item.lastnameT}
                          </Typography>
                        </Grid>
                      }
                    </Grid>
                    <Grid className={classes.containerImg}>
                      <img src={REACT_APP_URL_STORAGE + item.imgCar} className={classes.img} alt={item.descriptionImg} />
                      <Grid align="center" item className={classes.iconContainer}>
                        <IconButton className={classes.btnIcon} onClick={() => {
                          handleAlertDelete();
                          setCarSelected(item);
                        }}>
                          <Delete color='letters' className={classes.iconDelete} />
                        </IconButton>
                        <IconButton className={classes.btnIcon} onClick={() => {
                          handleOpenCard(item);
                          setCarSelected(item);
                        }}>
                          <Edit color='letters' className={classes.iconDelete} />
                        </IconButton>
                      </Grid>
                      <Grid align="center" item className={classes.contanedorModelo}>
                        <Grid container className={classes.tarjetaModelo}>
                          <Typography variant="h6" className={classes.txtModelo}>
                            {item.model}
                          </Typography>
                        </Grid>
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
        </Grid >
      )}
    />
  )


}

export default EditCarV
