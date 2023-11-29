import React, { useState, useRef, useContext } from 'react';
import {
    Grid,
    Skeleton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    IconButton,
    InputLabel,
    TextField,
    FormHelperText,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Flickity from 'react-flickity-component';
import "flickity/css/flickity.css";
import { HomeContext } from '../../../Providers/HomeContext';
import EditUsC from '../EditUs_C/EditUsC';
import { AddCircleOutline, Clear, Delete, Edit } from '@mui/icons-material';
import EstructuraV from '../../../estructura/EstructuraV';

const {
    REACT_APP_URL_STORAGE,
} = process.env;


const controllerEditUsC = new EditUsC();

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        backgroundColor: theme.palette.secondary.main,
    },
    img: {
        height: '250px',
        width: '250px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '1px solid rgba(0,0,0,0.30)',
        overflow: 'hidden',
        boxShadow: '0px 3px 15px 0px rgba(0,0,0,0.40)',
        transition: 'transform 0.4s',
    },
    fullname: {
        fontSize: '25px',
        fontWeight: 'bold',
        [theme.breakpoints.down('md')]: {
            fontSize: '15px',
        },

    },
    rol: {
        fontSize: '20px',
        color: theme.palette.header.main,
        fontStyle: 'italic',
        [theme.breakpoints.down('md')]: {
            fontSize: '15px',
        },
    },
    containerImg: {
        margin: '60px 80px 60px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dataContainer: {
        marginTop: '20px',
        backgroundColor: '#8bd184',
        borderRadius: '10px',
        padding: '2px 12px 2px 12px',
        marginLeft: theme.spacing(1),
        fontSize: '14px',
        boxShadow: '0px 3px 8px 0px #8bd184',
        transition: 'transform 0.4s',
    },
    containerSkeleton: {
        padding: '20px',
    },
    skeleton: {
        width: 250,
        height: 250,
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
    txtInput: {
        color: 'white',
        background: '#2c7825',
        borderRadius: '30px',
        textAlign: 'center',
        padding: '3px',
    },
    txtDialogHeaderDelete: {
        color: 'black',
        fontWeight: 700,
        fontSize: '20px',
        lineHeight: '1.5',
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
            marginLeft: theme.spacing(0),
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
    btnReg: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        background: theme.palette.letters.main,
        color: 'white',
        '&:hover': {
            background: theme.palette.btn.hover,
            color: 'white'
        },
    },
    btnAcept: {
        background: theme.palette.letters.main,
        color: 'white',
        '&:hover': {
            background: theme.palette.btn.hover,
            color: 'white'
        },
    },
    btnCancel: {
        background: 'red',
        color: 'white',
        '&:hover': {
            background: '#660500',
            color: 'white'
        },
    },
    btnIcon: {
        background: theme.palette.primary.main,
        '&:hover': {
            background: '#ffea9f',
            color: 'yellow'
        },
        marginRight: '10px',
    },
    helpForm: {
        color: 'red',
    },
}));

//======= OPCIONES CARROUSEL (flikity) =======
const flickityOptions = {
    initialIndex: 1,
    wrapAround: false,
    pageDots: false,
    selectedAttraction: 0.01,
    friction: 0.15,
    autoPlay: 6000,
};

const EditUsV = () => {

    //======= USE CONTEXT =======
    const { us,
        setUs,
        setAlert,
    } = useContext(HomeContext);

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //======= USE STATE =======
    const [openCard, setOpenCard] = useState(false);
    const [openDeleteCard, setOpenDeleteCard] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState(false);
    const [helpForm, setHelpForm] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    //===== USE REF ======
    const imgsRef = useRef([]);

    //Funcion que maneja el cambio de archivo
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    //Funcion que abre el modal
    const handleOpenCard = (item = "") => {
        //console.log(item)
        if (item !== "" && item.altKey === undefined) {
            if (item.type !== 'add') {
                item.type = 'edit'
            }
            setData(item);
        } else {
            setData({ name: '', description: '' })
        }
        setOpenCard(!openCard);
    };

    const handleAlertDelete = (item) => {
        setData(item);
        setOpenDeleteCard(!openDeleteCard);
    };

    const handleDeleteItem = () => {
        setAlert({ message: 'Eliminando item...', type: 'info', status: true })
        controllerEditUsC.delete(data)
            .then((resp) => {
                handleAlertDelete();
                if (resp.ok) {
                    setAlert({ message: 'Item eliminado correctamente!', type: 'success', status: true })
                    let carrouselNew = us.filter(person => person.id !== resp.data);
                    setUs(carrouselNew)
                } else {
                    console.log(resp)
                }
            })
            .catch((error) => {
                setAlert({ message: 'Error al eliminar item', type: 'error', status: true })
                console.log(error)
            });
    }

    //Funcion que guarda los cambios
    const saveChanges = (type) => {
        if (type === 'edit') {
            setAlert({ message: 'Guardando cambios...', type: 'info', status: true })          //Muestro el alert
            controllerEditUsC.edit(data, selectedFile)                                //Llamo al controlador para editar el curso
                .then((resp) => {
                    handleOpenCard();
                    if (resp.ok) {
                        setAlert({ message: resp.message, type: 'success', status: true })
                        setOpenCard(false);
                        setUs(resp.data)
                    } else {
                        setAlert({ message: resp.message, type: 'error', status: true })
                        console.log(resp)
                    }
                })
                .catch((error) => {
                    console.log(error)
                });
        } else if (type === 'add') {
            if (data.name !== '' && data.description !== '') {
                setAlert({ message: 'Creando miembro...', type: 'info', status: true })               //Muestro el alert
                controllerEditUsC.save(data, selectedFile)                                //Llamo al controlador para editar el curso
                    .then((resp) => {
                        handleOpenCard();
                        if (resp.ok) {
                            setAlert({ message: resp.message, type: 'success', status: true })
                            setOpenCard(false);
                            setUs(resp.data)
                        } else {
                            setAlert({ message: resp.message, type: 'error', status: true })
                            console.log(resp)
                        }
                    })
                    .catch((error) => {
                        setAlert({ message: 'Error con el servidor, porfavor comuniquese con soporte', type: 'error', status: true })
                        console.log(error)
                    });
            } else {
                setHelpForm('Debe completar todos los campos y agregar una imagen')
                setError(true)
            }
        }
    }

    //Funcion que activa o desactiva un curso
    // const handleStatus = (item) => {
    //     if (item.status) {
    //         setAlert({ message: 'Desactivando item...', type: 'info', status: true })
    //         controllerEditUsC.activate(item)
    //             .then((resp) => {
    //                 if (resp.ok) {
    //                     setAlert({ message: resp.message, type: 'success', status: true })
    //                     setUs(resp.data.data)
    //                 } else {
    //                     console.log(resp)
    //                 }
    //             }).catch((error) => {
    //             });
    //     } else {
    //         setAlert({ message: 'Activando item...', type: 'info', status: true })
    //         controllerEditUsC.desactivate(item)
    //             .then((resp) => {
    //                 if (resp.ok) {
    //                     setAlert({ message: resp.message, type: 'success', status: true })
    //                     setUs(resp.data.data)
    //                 } else {
    //                     console.log(resp)
    //                 }
    //             }).catch((error) => {
    //             });
    //     }
    // };

    return (
        <EstructuraV
            render={() => (
                <Grid className={classes.container} id='us'>
                    {/* Modal que verifica si quiere eliminar el item */}
                    <Dialog
                        open={openDeleteCard}
                        onClose={handleAlertDelete}
                        aria-labelledby="Esperando"
                        aria-describedby="Esprando a cargar la pagina"
                    >
                        <DialogTitle id="alert-dialog-title" align="center">
                            <Grid container spacing={1} justifyContent='center'>
                                <Typography variant="h6" className={classes.txtDialogHeaderDelete}>
                                    Esta seguro de querer eliminar el miembro?
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

                    {/* MODAL EDICION CURSO */}
                    <Dialog
                        open={openCard}
                        onClose={handleOpenCard}
                        aria-labelledby="Esperando"
                        aria-describedby="Esprando a cargar la pagina"
                    >
                        <DialogTitle id="alert-dialog-title" align="center">
                            <Grid container spacing={2}>
                                {data &&
                                    <Grid item container justifyContent='center' xs={12}>
                                        <Grid item xs={9} md={10}>
                                            <Typography variant="h6" className={classes.txtDialogHeader}>
                                                {data.type === 'edit' ? 'Editar miembro' : 'Agregar miembro'}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <IconButton onClick={handleOpenCard}>
                                                <Clear color='letters' />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                }
                            </Grid>
                        </DialogTitle>
                        <DialogContent>
                            {data &&
                                <Grid container spacing={2} alignItems="center" justifyContent='center'>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            id="name"
                                            color="letters"
                                            label="Nombre del miembro"
                                            variant="filled"
                                            fullWidth
                                            value={data.name}
                                            error={error}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    saveChanges(data.type)
                                                }
                                            }}
                                            onChange={(e) => {
                                                setError(false);
                                                setHelpForm('');
                                                setData({ ...data, name: e.target.value })
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            id="rol"
                                            color="letters"
                                            label="Puesto del Miembro"
                                            variant="filled"
                                            fullWidth
                                            value={data.description}
                                            error={error}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    saveChanges(data.type)
                                                }
                                            }}
                                            onChange={(e) => {
                                                setError(false);
                                                setHelpForm('');
                                                setData({ ...data, description: e.target.value })
                                            }}
                                        />
                                    </Grid>
                                    <FormHelperText className={classes.helpForm}>{helpForm}</FormHelperText>
                                    <Grid item xs={12}>
                                        <InputLabel className={classes.txtInput}>Imagen</InputLabel>
                                        <input type="file" name='img' id='img' onChange={handleFileChange} color='black' />
                                    </Grid>
                                    <Grid item xs={12} align='center' >
                                        <Button
                                            variant='contained'
                                            className={classes.btnReg}
                                            onClick={() => saveChanges(data.type)}
                                        >
                                            {data.type === 'edit' ? 'Guardar cambios' : 'Crear miembro'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            }
                        </DialogContent>
                    </Dialog>

                    <Grid item container direction='column' align="center">
                        <Grid item>
                            <Typography variant='h2' sx={{ fontWeight: 600, fontSize: { xs: '30px', md: '60px' }, marginBottom: '0.5rem' }}>
                                NOSOTROS
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography component='p' sx={{ fontSize: { xs: '15px', md: '20px' }, fontStyle: 'italic' }}>
                                Un equipo altamente capacitado para acompañarte en tu proceso de aprendizaje
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center" alignItems='center'>
                        <Button
                            variant='contained'
                            className={classes.btnReg}
                            onClick={() => handleOpenCard({ name: '', description: '', type: 'add' })}
                        >
                            AGREGAR MIEMBRO
                            <AddCircleOutline color='white' />
                        </Button>
                    </Grid>
                    <Grid >
                        {us ? (
                            <Flickity
                                elementType={'div'}
                                options={flickityOptions}
                                disableImagesLoaded={false}
                                reloadOnUpdate
                            >
                                {us.map((item, index) => (
                                    <Grid key={index} item className={classes.containerImg}>
                                        <Grid container justifyContent='center'>
                                            <IconButton className={classes.btnIcon} onClick={() => handleOpenCard(item)}>
                                                <Edit color='letters' />
                                            </IconButton>
                                            <IconButton className={classes.btnIcon} onClick={() => handleAlertDelete(item)} >
                                                <Delete color='letters' />
                                            </IconButton>
                                        </Grid>
                                        <img
                                            ref={ref => (imgsRef.current[index] = ref)}
                                            src={REACT_APP_URL_STORAGE + item.photoUser}
                                            className={classes.img}
                                            alt={'imagen ' + item.id}
                                        />
                                        <Grid item container direction='column' alignContent='center' align='center' className={classes.dataContainer}>
                                            <Typography component='p' className={item.description}>
                                                {item.fullNames}
                                            </Typography>
                                            <Typography component='p' className={classes.rol}>
                                                {item.description}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Flickity>
                        ) : (
                            <Grid container className={classes.containerSkeleton} spacing={10} justifyContent="center">
                                <Grid item>
                                    <Skeleton animation="wave" variant="circular" className={classes.skeleton} />
                                </Grid>
                                <Grid item>
                                    <Skeleton animation="wave" variant="circular" className={classes.skeleton} />
                                </Grid>
                                <Grid item>
                                    <Skeleton animation="wave" variant="circular" className={classes.skeleton} />
                                </Grid>
                            </Grid>
                        )
                        }
                    </Grid>
                </Grid>
            )}
        />
    )
};

export default EditUsV;
