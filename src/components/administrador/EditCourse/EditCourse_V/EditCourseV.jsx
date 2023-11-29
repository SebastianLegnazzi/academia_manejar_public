import React, { useContext, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { InfoOutlined, Edit, Clear, AddCircleOutline, ToggleOff, ToggleOn } from '@mui/icons-material';
import {
    Grid,
    List, ListItem,
    Card,
    CardContent,
    Typography,
    CardMedia,
    Paper,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    TextField,
    InputLabel,
    Chip,
    Button,
} from '@mui/material';
import { HomeContext } from '../../../Providers/HomeContext';
import EstructuraV from '../../../estructura/EstructuraV';
import EditCourseC from '../EditCourse_C/EditCourseC';
import { useFormik } from 'formik';

const {
    REACT_APP_URL_STORAGE,
} = process.env;

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
    container: {
        padding: '30px 10px 30px 10px',
        background: theme.background.style1,
    },
    iconInfo: {
        fontSize: '120%',
        color: theme.palette.letters.color3,
    },
    title: {
        fontWeight: 700,
        fontSize: '30px',
    },
    price: {
        fontWeight: 700,
        color: 'black',
    },
    cardContainer: {
        borderRadius: '20px',
        width: '100%',
        height: '100%',
    },
    card: {
        borderRadius: '20px',
        height: '100%',
        backgroundColor: '#e1a76b',
    },
    listText: {
        backgroundColor: theme.palette.background.color3,
        borderRadius: '10px',
        padding: '5px 20px 5px 20px',
        marginLeft: theme.spacing(1),
        fontSize: '15px',
    },
    listItem: {
        [theme.breakpoints.down('md')]: {
            flexBasis: '90%',
        },
        aligncourses: 'center',
        flexBasis: '50%',
    },
    cardMedia: {
        height: 140,
    },
    list: {
        width: '100%',
        maxWidth: 500,
        bgcolor: 'background.paper',
        display: 'flex',
        flexWrap: 'wrap',
    },
    skeleton: {
        width: 400,
        height: 500,
        [theme.breakpoints.down('md')]: {
            width: 250,
            height: 300,
        },
    },
    btnReg: {
        ...theme.button,
        backgroundColor: theme.palette.btn.color3,
        '&:hover': {
            backgroundColor: theme.palette.btn.color3H,
        },
        color: 'black',
    },
    btnEdit: {
        color: theme.palette.letters.color3,
    },
    btnDelete: {
        color: theme.palette.letters.color6,
    },
    txtDialogHeader: {
        color: theme.palette.letters.color5,
    },
    btnAcept: {
        background: theme.palette.letters.color1,
        color: 'white',
        '&:hover': {
            background: theme.palette.btn.color1H,
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
    txtDelete: {
        color: '#660500',
        fontSize: '15px',
        lineHeight: '1.5',
        [theme.breakpoints.down('md')]: {
            fontSize: '13px',
        },
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
    btnOn: {
        fontSize: '35px',
        color: theme.palette.letters.color3,
    },
    cardTrite: {
        filter: 'grayscale(100%)',
    },
    btnOff: {
        filter: 'grayscale(0)',
        fontSize: '35px',
        color: theme.palette.letters.color3,
    },
    containerCards: {
        padding: 0,
    },

}));
const controllerEditCourseC = new EditCourseC();

const EditCourseV = () => {

    //======= USE STATE =======
    const [openCard, setOpenCard] = useState(false);
    const [openDeleteCard, setOpenDeleteCard] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState(false);
    const [newChip, setNewChip] = useState("");
    const [chipData, setChipData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    // const [courses, setCourses] = useState(null);


    //======= USE CONTEXT =======
    const {
        coursesEdit,
        setCoursesEdit,
        setAlert,
        setOpenModal,
    } = useContext(HomeContext);

    useEffect(() => {
        if ((!coursesEdit)) {
            controllerEditCourseC.getCourse()
                .then((data) => {
                    if (data.ok) {
                        console.log(data)
                        setCoursesEdit(data.data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    })

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //======= FUNCIONES =======
    //Funcion que maneja el cambio de archivo
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    //Funcion que abre el modal
    const handleOpenCard = (item = "") => {
        if (item !== "" && item.altKey === undefined) {
            if (item.type !== 'add') {
                item.type = 'edit'
            }
            setData(item);
            formik.values.title = item.title;
            formik.values.price = item.price;
            formik.values.priceReserv = item.price_reservation;
            formik.values.cantClass = item.cant_class;
            setChipData(item.features)
        } else {
            cleanData();
        }
        setOpenCard(!openCard);
    };

    //funcion que abre o cierra el alert
    const handleAlertDelete = (item) => {
        setData(item);
        setOpenDeleteCard(!openDeleteCard);
    };

    //Funcion que agrega un chip
    const handleAddChip = () => {
        if (newChip !== "") {
            chipData.push({ key: chipData.length, label: newChip });
            setChipData(chipData);
            setData({ ...data, features: chipData })
            setNewChip("");
        }
    };

    //Funcion que elimina un chips
    const handleDelete = (chipToDelete) => () => {
        let chipFilter = chipData.filter((chip) => chip.key !== chipToDelete.key);
        setChipData(chipFilter);
        setData({ ...data, features: chipFilter })
    };

    //funcion que se encarga de llamar al controlador para eliminar un item
    const handleDeleteItem = (action) => {
        setAlert({ message: action === 'activate' ? 'Activando Curso...' : 'Desactivando Curso...', type: 'info', status: true })
        controllerEditCourseC.delete(data, action)
            .then((resp) => {
                handleAlertDelete();
                if (resp.ok) {
                    setAlert({ message: action === 'activate' ? 'Curso activado!' : 'Curso desactivado!', type: 'success', status: true })
                    setCoursesEdit(resp.data)
                } else {
                    console.log(resp)
                }
            })
            .catch((error) => {
                setAlert({ message: 'Error al eliminar item', type: 'error', status: true })
                console.log(error)
            });
    }

    const cleanData = () => {
        // console.log(formik.errors)
        setNewChip("");
        formik.resetForm();
        setData({ title: '', price: '', features: [], type: '', price_reservation: '', cant_class:'' })
        setChipData([{ key: 0, label: '' }])
        setSelectedFile(null);
    }

    //Funcion que guarda los cambios
    const saveChanges = (type) => {
        if (!error) {
            if (type === 'edit') {
                setOpenModal({ title: 'Guardando cambios...', message: 'Estamos actualizando los datos', open: true, loading: true }) //Muestro el alert
                controllerEditCourseC.edit(data, selectedFile)                                //Llamo al controlador para editar el curso
                    .then((resp) => {
                        handleOpenCard();
                        if (resp.ok) {
                            setAlert({ message: resp.message, type: 'success', status: true });
                            setCoursesEdit(resp.data);
                            setOpenModal({ open: false });
                        } else {
                            setAlert({ message: resp.message, type: 'error', status: true });
                            setOpenModal({ open: false });
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            } else if (type === 'add') {
                setOpenModal({ title: 'Creando item...', message: 'Estamos creando los datos', open: true, loading: true }) //Muestro el alert
                controllerEditCourseC.save(data, selectedFile)                                //Llamo al controlador para editar el curso
                    .then((resp) => {
                        handleOpenCard();
                        if (resp.ok) {
                            setAlert({ message: resp.message, type: 'success', status: true });
                            setOpenModal({ open: false });
                            setCoursesEdit(resp.data);
                        } else {
                            setAlert({ message: resp.message, type: 'error', status: true });
                            setOpenModal({ open: false });
                        }
                    })
                    .catch((error) => {
                        setAlert({ message: 'Error con el servidor, porfavor comuniquese con soporte', type: 'error', status: true })
                        console.log(error)
                    });
            }
            setOpenCard(false);
            cleanData();
        } else {
            setAlert({ message: 'Error al guardar los cambios, porfavor revise los campos', type: 'error', status: true })
        }
    }

    const validate = values => {
        const errors = {};
        const letrasRegEx = /^[A-Za-zñÑ\s]+$/;
        const numRegEx = /^[0-9]+$/;

        if (!values.title) {
            errors.title = 'Campo Obligatorio';
        } else if (!letrasRegEx.test(values.title)) {
            errors.title = 'Debe contener solo letras';
        }

        if (!values.price) {
            errors.price = 'Campo Obligatorio';
        } else if (!numRegEx.test(values.price)) {
            errors.price = 'Debe contener solo numeros';
        }

        if (!values.priceReserv) {
            errors.priceReserv = 'Campo Obligatorio';
        } else if (!numRegEx.test(values.priceReserv)) {
            errors.priceReserv = 'Debe contener solo numeros';
        }

        if (!values.cantClass) {
            errors.cantClass = 'Campo Obligatorio';
        } else if (!numRegEx.test(values.cantClass)) {
            errors.cantClass = 'Debe contener solo numeros';
        }

        if (Object.keys(errors).length === 0) {
            setError(false)
            setData({ ...data, title: values.title, price: values.price, price_reservation: values.priceReserv, features: chipData, cant_class: values.cantClass })
        } else {
            setError(true)
        }

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            title: '',
            price: '',
            priceReserv: '',
            cantClass: '',
        },
        validate
    });

    //======= VISTA =======
    return (
        <EstructuraV
            render={() => (
                <Grid item container className={classes.container} id='curses' align="center" alignContent="center">
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
                                    {data && data.deleted_at ? (
                                        <>¿Desea Activar este Curso?</>
                                    ) : (
                                        <>¿Desea Desactivar este Curso?</>
                                    )}
                                </Typography>
                            </Grid>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2} alignItems="center" justifyContent='center'>
                                <Grid item align='center'>
                                    {data && data.deleted_at ? (
                                        <Button
                                            variant='contained'
                                            className={classes.btnAcept}
                                            size='small'
                                            onClick={() => handleDeleteItem('activate')}
                                        >
                                            Activar
                                        </Button>
                                    ) :
                                        (
                                            <Button
                                                variant='contained'
                                                className={classes.btnAcept}
                                                size='small'
                                                onClick={() => handleDeleteItem('deactivate')}
                                            >
                                                Desactivar
                                            </Button>
                                        )}

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
                                <Grid item container justifyContent='center' xs={12}>
                                    <Grid item xs={12} md={11}>
                                        {data &&
                                            <Typography variant="h6" className={classes.txtDialogHeader}>
                                                {data.type === 'edit' ? 'Editar item' : 'Agregar item'}
                                            </Typography>
                                        }
                                    </Grid>
                                    <Grid item>
                                        <IconButton onClick={handleOpenCard}>
                                            <Clear color='letters' />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DialogTitle>
                        <DialogContent>
                            {data &&
                                <Grid container spacing={2} alignItems="center" justifyContent='center'>
                                    <Grid item container xs={12} md={6}>
                                        <TextField
                                            id="title"
                                            color="letters"
                                            label="Nombre del item"
                                            variant="filled"
                                            fullWidth
                                            value={formik.values.title}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.errors.title && formik.touched.title}
                                            inputProps={{ maxLength: 20, type: 'text' }}
                                            helperText={formik.errors.title && formik.touched.title ? formik.errors.title : null}
                                        />
                                    </Grid>
                                    <Grid item container xs={12} md={6}>
                                        <TextField
                                            id="price"
                                            color="letters"
                                            label="Precio"
                                            variant="filled"
                                            fullWidth
                                            value={formik.values.price}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.errors.price && formik.touched.price}
                                            helperText={formik.errors.price && formik.touched.price ? formik.errors.price : null}
                                        />
                                    </Grid>
                                    <Grid item container xs={12} md={6}>
                                        <TextField
                                            id="priceReserv"
                                            color="letters"
                                            label="Precio de Reservación"
                                            variant="filled"
                                            fullWidth
                                            value={formik.values.priceReserv}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.errors.priceReserv && formik.touched.priceReserv}
                                            helperText={formik.errors.priceReserv && formik.touched.priceReserv ? formik.errors.priceReserv : null}
                                        />
                                    </Grid>
                                    <Grid item container xs={12} md={6}>
                                        <TextField
                                            id="cantClass"
                                            color="letters"
                                            label="Cantidad de clases"
                                            variant="filled"
                                            fullWidth
                                            value={formik.values.cantClass}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.errors.cantClass && formik.touched.cantClass}
                                            helperText={formik.errors.cantClass && formik.touched.cantClass ? formik.errors.cantClass : null}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <TextField
                                            id="items"
                                            color="letters"
                                            label="Agregar un item a la lista"
                                            variant="filled"
                                            fullWidth
                                            value={newChip}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleAddChip()
                                                }
                                            }}
                                            onChange={(e) => {
                                                setNewChip(e.target.value)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={3} align='center'>
                                        <Button
                                            variant='contained'
                                            className={classes.btnReg}
                                            onClick={handleAddChip}
                                        >
                                            Agregar
                                        </Button>
                                    </Grid>
                                    <Grid item container spacing={1} xs={12}>
                                        {chipData &&
                                            chipData.map((data, index) => (
                                                <Grid item key={index}>
                                                    <Chip
                                                        sx={{
                                                            height: 'auto',
                                                            '& .MuiChip-label': {
                                                                display: 'block',
                                                                whiteSpace: 'normal',
                                                            },
                                                        }}
                                                        label={data.label}
                                                        onDelete={() => handleDelete(data)}
                                                    />
                                                </Grid>
                                            ))
                                        }
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputLabel className={classes.txtInput}>Imagen</InputLabel>
                                        <input type="file" name='img' id='img' onChange={handleFileChange} color='black' />
                                    </Grid>
                                    <Grid item xs={12} align='center'>
                                        <Button
                                            variant='contained'
                                            className={classes.btnReg}
                                            onClick={() => saveChanges(data.type)}
                                            disabled={error}
                                        >
                                            {data.type === 'edit' ? 'Guardar cambios' : 'Crear item'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            }
                        </DialogContent>
                    </Dialog>
                    <Grid container justifyContent="center" alignItems='center' marginBottom={3}>
                        <Button
                            variant='contained'
                            className={classes.btnReg}
                            onClick={() => handleOpenCard({ title: '', price: '', features: [], type: 'add', price_reservation: '' })}
                        >
                            AGREGAR ITEM
                            <AddCircleOutline color='white' />
                        </Button>
                    </Grid>
                    <Grid item container justifyContent="center" className={classes.containerCards}>
                        {coursesEdit ? (
                            coursesEdit.map((item, index) => (
                                <Grid item key={index} xs={8} md={5} lg={4} margin={3} className={item.deleted_at ? classes.cardTrite : null}>
                                    <Paper className={classes.cardContainer} elevation={12}>
                                        <Card className={classes.card} >
                                            {item.url_data &&
                                                <CardMedia
                                                    sx={{ height: 140 }}
                                                    image={REACT_APP_URL_STORAGE + item.url_data.url}
                                                    alt={REACT_APP_URL_STORAGE + item.url_data.url}
                                                />
                                            }
                                            <CardContent>
                                                <Grid container direction='column' spacing={1}>
                                                    <Grid item container justifyContent='end' spacing={2}>
                                                        {item.deleted_at ? (
                                                            <Grid item>
                                                                <IconButton onClick={() => handleAlertDelete(item)} >
                                                                    <ToggleOff color='letters' className={classes.btnOff} />
                                                                </IconButton>
                                                            </Grid>
                                                        ) :
                                                            (
                                                                <>
                                                                    <Grid item>
                                                                        <IconButton onClick={() => handleOpenCard(item)} >
                                                                            <Edit color='letters' className={classes.btnEdit} />
                                                                        </IconButton>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <IconButton onClick={() => handleAlertDelete(item)} >
                                                                            <ToggleOn color='letters' className={classes.btnOn} />
                                                                        </IconButton>
                                                                    </Grid>
                                                                </>
                                                            )}
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography className={classes.title} >
                                                            {item.title}
                                                        </Typography>
                                                        <Typography variant="h6" className={classes.price}>$ {item.price}</Typography>
                                                    </Grid>
                                                </Grid>
                                                <List className={classes.list}>
                                                    {item.features.map((feature, idx) => (
                                                        <ListItem className={classes.listItem} key={idx}>
                                                            <InfoOutlined className={classes.iconInfo} />
                                                            <Typography className={classes.listText}>
                                                                {feature.label}
                                                            </Typography>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Paper>
                                </Grid>
                            ))
                        ) : (
                            <Grid item container spacing={10} justifyContent="center" align="center">
                                <Grid item>
                                    <Skeleton variant="rectangular" animation="wave" className={classes.skeleton} />
                                </Grid>
                                <Grid item>
                                    <Skeleton variant="rectangular" animation="wave" className={classes.skeleton} />
                                </Grid>
                            </Grid>
                        )
                        }
                    </Grid >
                </Grid >
            )}
        />
    )
}

export default EditCourseV 