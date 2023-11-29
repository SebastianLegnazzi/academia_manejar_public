import React, { createRef, useContext, useState } from 'react';
import {
    Button,
    Grid,
    Paper,
    Typography,
    Avatar,
    Slider,
    TextField,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import EstructuraV from '../../../estructura/EstructuraV';
import { UserContext } from '../../../Providers/UserContext';
import AvatarEditor from 'react-avatar-editor';
import ProfileC from '../Profile_C/ProfileC';
import { HomeContext } from '../../../Providers/HomeContext';
import { useFormik } from 'formik';

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
    containerProfile: {
        background: theme.background.style4,
        padding: '100px 0px',
        [theme.breakpoints.down('lg')]: {
            padding: '100px 0px',
        },
        [theme.breakpoints.down('md')]: {
            padding: '50px 0px',
        },
    },
    textHeader: {
        color: theme.palette.letters.color5,
        textAlign: 'center',
    },
    inputContainer: {
        width: '90%',
    },
    textRolTitle: {
        fontWeight: 700,
    },
    textContainer: {
        display: 'inline-block',
        padding: '3px 20px 3px',
        marginBottom: '20px',
        borderRadius: '40px',
        backgroundColor: theme.palette.background.color4,
    },
    fotoContainer: {
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    circleBorder: {
        width: '215px',
        height: '215px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px solid #D9D9D9', // ancho y color del borde
    },
    circleContainer: {
        marginTop: '20px',
        [theme.breakpoints.down('lg')]: {
            marginTop: '100px',
        },
        [theme.breakpoints.down('md')]: {
            marginTop: '10px',
        },
    },
    buttonContainer: {
        marginTop: '50px',
    },
    btnEdit: {
        ...theme.button,
        backgroundColor: theme.palette.btn.color1,
        color: theme.palette.letters.color4,
        '&:hover': {
            backgroundColor: theme.palette.btn.color1H,
        },
        padding: "8px",
    },
    btnCancel: {
        ...theme.button,
        backgroundColor: theme.palette.btn.color2,
        color: theme.palette.letters.color4,
        '&:hover': {
            backgroundColor: theme.palette.btn.color2H,
        },
        marginRight: "12px",
        padding: "8px",
    },
    textImageNew: {
        color: theme.palette.letters.color3,
    },
    textTitle: {
        color: theme.palette.letters.color5,
    },
    textTitleContainer:{
        background: theme.background.style5,
        borderRadius: '20px',
        padding: '10px 5px',
    },
    subTitle:{
        fontSize: '20px',
        color: theme.palette.letters.color2,
        fontWeight: '500',
    },
}));

const {
    REACT_APP_URL_STORAGE,
} = process.env;

const controllerProfile = new ProfileC();

const EditProfileV = () => {

    // ======= CONTEXTOS =======
    const { user, setUser } = useContext(UserContext);
    const { setAlert, setOpenModal } = useContext(HomeContext);

    // ======= VARIABLE ESTILOS =======
    const classes = useStyles();

    const [foto, setFoto] = useState(user && user.photoUser ? REACT_APP_URL_STORAGE + user.photoUser : null);
    const [zoom, setZoom] = useState(1);
    const [editar, setEditar] = useState(false);
    const [error, setError] = useState(false);
    const editorRef = createRef();

    //Guardo para mantener los datos del usuario original
    const [userOriginal] = useState({ ...user });

    // Guarda la imagen
    const handleSave = () => {
        let canvas
        if (editorRef.current) {
            console.log(editorRef.current)
            canvas = editorRef.current.getImage();
            // Convertir el contenido del <canvas> a un Blob
            canvas.toBlob((blob) => {
                if (blob) {
                    saveChanges(user, blob);
                }
            });
        } else {
            saveChanges(user);
        }
        handleEdit();
    };

    //Funcion que realiza la consulta
    const saveChanges = (user, blob) => {
        console.log(blob)
        setOpenModal({ title: 'Guardando Datos', message: 'Aguarde un momento...', open: true, loading: true });
        controllerProfile.editProfile(user, blob)
            .then(resp => {
                setOpenModal({ open: false });
                if (resp.ok) {
                    setUser(resp.data);
                    setAlert({ message: 'Perfil guardado correctamente', type: 'success', status: true });
                } else {
                    setAlert({ message: resp.message, type: 'error', status: true });
                    setUser(userOriginal)
                    formik.resetForm()
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    const handleEdit = () => {
        setFoto(null)
        setEditar(!editar);
    }

    //============================= FORMIK =================================
    const validate = values => {
        const errors = {};
        const letrasRegEx = /^[A-Za-zñÑ\s]+$/;

        if (!values.username) {
            errors.username = 'Campo Obligatorio';
        }

        if (!values.name) {
            errors.name = 'Campo Obligatorio';
        } else if (!letrasRegEx.test(values.name)) {
            errors.name = 'Debe contener solo letras';
        }

        if (!values.lastName) {
            errors.lastName = 'Campo Obligatorio';
        } else if (!letrasRegEx.test(values.lastName)) {
            errors.lastName = 'Deben contener solo letras';
        }

        if (!values.email) {
            errors.email = 'Campo Obligatorio';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Por favor ingrese un email valido';
        }

        if (Object.keys(errors).length === 0) {
            setError(false)
            setUser({ ...user, name: values.name, lastName: values.lastName, email: values.email, username: values.username })
        } else {
            setError(true)
        }

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            username: user.username,
            email: user.email,
            name: user.name,
            lastName: user.lastname,
        },

        validate
    });

    //======= VISTA =======
    return (
        <EstructuraV
            render={() => (
                <Grid item container justifyContent='center' alignItems='center' className={classes.containerProfile}>
                    <Grid item container direction='column' spacing={2} md={3}>
                        <Grid item align='center' className={classes.circleContainer}>
                            {foto && editar ? (
                                <Grid container direction='column' alignContent='center'>
                                    <AvatarEditor
                                        ref={editorRef}
                                        image={foto}
                                        width={220}
                                        height={220}
                                        borderRadius={200}
                                        scale={zoom}
                                        rotate={0}
                                    />
                                    <Grid item>
                                        <Slider
                                            aria-label="Zoom"
                                            defaultValue={1}
                                            valueLabelDisplay="auto"
                                            step={0.01}
                                            min={1}
                                            max={6}
                                            onChange={(e, newValue) => setZoom(newValue)}
                                        />
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid className={classes.circleBorder}>
                                    <Avatar className={classes.fotoContainer} alt="Avatar" src={REACT_APP_URL_STORAGE + user.photoUser} />
                                </Grid>
                            )
                            }
                            {editar &&
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const selectedFile = e.target.files[0];
                                        if (selectedFile) {
                                            const objectUrl = URL.createObjectURL(selectedFile);
                                            setFoto(objectUrl);
                                        }
                                    }}
                                />
                            }
                        </Grid>
                        <Grid item align='center'>
                            <Paper className={classes.textContainer} elevation={6} square={false}>
                                <Typography variant='h5' component='h5' className={classes.textRolTitle}>Rol</Typography>
                                <Typography variant='h5' component='h5' className={classes.textRol}>
                                    {user.roleNames.split('#').length > 1 ? user.roleNames.split('#').join(', ') : user.roleNames}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid item md={7} container direction='column'>
                        <Grid item>
                            <Typography variant='h3' component='h3' className={classes.textHeader}>Perfil</Typography>
                        </Grid>
                        <Grid item container justifyContent='center' align='center' spacing={2} className={classes.mainInputContainer}>
                            <Grid item md={9} lg={5} className={classes.inputContainer} >
                                {editar ? (
                                    <TextField
                                        className={classes.input}
                                        variant='filled'
                                        color="letters"
                                        label="Nombre de Usuario"
                                        fullWidth
                                        id="username"
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.errors.username && formik.touched.username}
                                        helperText={formik.errors.username}
                                        inputProps={{ maxLength: 20, type: 'text' }}
                                    />
                                ) : (
                                    <Grid className={classes.textTitleContainer}>
                                        <Typography variant='h6' component='h6' className={classes.textTitle}>Nombre de usuario</Typography>
                                        <Typography className={classes.subTitle}> {formik.values.username} </Typography>
                                    </Grid>
                                )}

                            </Grid>
                            <Grid item md={9} lg={5} className={classes.inputContainer} >
                                {editar ? (
                                    <TextField
                                        className={classes.input}
                                        variant='filled'
                                        color="letters"
                                        label="Email"
                                        fullWidth
                                        id="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={!editar}
                                        error={formik.errors.email && formik.touched.email}
                                        helperText={formik.errors.email}
                                    />
                                ) : (
                                    <Grid className={classes.textTitleContainer}>
                                        <Typography variant='h6' component='h6' className={classes.textTitle}> Email </Typography>
                                        <Typography className={classes.subTitle}> {formik.values.email} </Typography>
                                    </Grid>
                                )}
                            </Grid>
                            <Grid item md={9} lg={5} className={classes.inputContainer} >
                                {editar ? (
                                    <TextField
                                        className={classes.input}
                                        variant='filled'
                                        color="letters"
                                        label="Nombre"
                                        fullWidth
                                        id="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={!editar}
                                        error={formik.errors.name && formik.touched.name}
                                        helperText={formik.errors.name}
                                        inputProps={{ maxLength: 50, type: 'text' }}
                                    />
                                ) : (
                                    <Grid className={classes.textTitleContainer}>
                                        <Typography variant='h6' component='h6' className={classes.textTitle}> Nombre </Typography>
                                        <Typography className={classes.subTitle}> {formik.values.name} </Typography>
                                    </Grid>
                                )}
                            </Grid>
                            <Grid item md={9} lg={5} className={classes.inputContainer} >
                                {editar ? (
                                    <TextField
                                        className={classes.input}
                                        variant='filled'
                                        color="letters"
                                        label="Apellido"
                                        fullWidth
                                        id="lastName"
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={!editar}
                                        error={formik.errors.lastName && formik.touched.lastName}
                                        helperText={formik.errors.lastName}
                                        inputProps={{ maxLength: 50, type: 'text' }}
                                    />
                                ) : (
                                    <Grid className={classes.textTitleContainer}>
                                        <Typography variant='h6' component='h6' className={classes.textTitle}> Apellido </Typography>
                                        <Typography className={classes.subTitle}> {formik.values.lastName} </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                        {editar ? (
                            <Grid item alignSelf='center' className={classes.buttonContainer}>
                                <Button onClick={handleEdit} color='letters' className={classes.btnCancel}>Cancelar</Button>
                                <Button onClick={handleSave} disabled={error} color='letters' className={classes.btnEdit}>Guardar</Button>
                            </Grid>
                        ) : (
                            <Grid item alignSelf='center' className={classes.buttonContainer}>
                                <Button onClick={handleEdit} className={classes.btnEdit}>Editar</Button>
                            </Grid>
                        )
                        }

                    </Grid>
                </Grid >
            )}
        />
    )
}

export default EditProfileV