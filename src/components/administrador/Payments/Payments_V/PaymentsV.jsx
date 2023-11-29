import React, { useContext, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Paper,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
} from '@mui/material';
import { HomeContext } from '../../../Providers/HomeContext';
import EstructuraV from '../../../estructura/EstructuraV';
import PaymentsC from '../Payments_C/PaymentsC';
import dayjs from 'dayjs';

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
    container: {
        padding: '30px 10px 30px 10px',
        background: theme.background.style3,
    },
    cardContainer: {
        borderRadius: '20px',
        width: '100%',
        height: '100%',
    },
    card: {
        borderRadius: '20px',
        height: '100%',
    },
    skeleton: {
        borderRadius: '20px',
        width: 300,
        height: 400,
        [theme.breakpoints.down('md')]: {
            width: 250,
            height: 300,
        },
    },
    txtDialogHeader: {
        color: theme.palette.letters.color5,
    },
    btnCancel: {
        background: 'red',
        color: 'white',
        '&:hover': {
            background: '#660500',
            color: 'white'
        },
    },
    txtDialogHeaderDelete: {
        padding: '0 !important',
        color: theme.palette.letters.color5,
        fontWeight: 700,
        fontSize: '20px',
        lineHeight: '1.5',
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
            marginLeft: theme.spacing(0),
        },
    },
    subtitle: {
        fontSize: '13px',
        textAlign: 'start',
        fontWeight: 600,
    },
    titlesub: {
        fontSize: '20px',
        textAlign: 'start !important',
    },
    inputDialog: {
        width: '100%',
        marginBottom: 5,
    },
    modal: {
        width: '70% !important',
    }
}));
const paymentsC = new PaymentsC();

const PaymentsV = () => {
    //======= USE STATE =======
    const [openCard, setOpenCard] = useState(false);
    const [openDeleteCard, setOpenDeleteCard] = useState(false);
    const [data, setData] = useState([]);
    const [pays, setPays] = useState(null);
    const [error, setError] = useState(false);
    const [amountConfirm, setAmountConfirm] = useState(0);
    const [metodoPay, setMetodoPay] = useState('Efectivo');

    //======= USE CONTEXT =======
    const {
        setAlert,
        setOpenModal,
    } = useContext(HomeContext);

    useEffect(() => {
        if ((!pays)) {
            paymentsC.getTurnsExeptPay()
                .then((data) => {
                    if (data.ok) {
                        setPays(data.data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [pays])

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //Funcion que abre el modal
    const handleOpenCard = () => {
        setOpenCard(!openCard);
    };

    //funcion que abre o cierra el alert
    const handleOpenDialog = (item, accion) => {
        if (accion === 'baja') {
            setOpenDeleteCard(true);
        } else {
            setOpenDeleteCard(false);
        }
        if (!openCard) {
            setData(item);
            setAmountConfirm(item.saldo);
        }

        setOpenCard(!openCard);
    };

    const handleChangeAmount = (event) => {
        setAmountConfirm(event.target.value);
        if (event.target.value <= 0 || event.target.value > data.saldo) {
            setError(true);
        } else {
            setError(false);
        }
    };

    const handleChangeMetodPay = (event) => {
        setMetodoPay(event.target.value);
    };

    //Funcion que guarda los cambios
    const saveChanges = (type) => {
        setOpenModal({ title: 'Guardando cambios...', message: 'Estamos actualizando los datos', open: true, loading: true }) //Muestro el alert
        if (type === 'edit') {
            editDebtSould();
        } else if (type === 'baja') {
            darBajaDebt();
        }
        setOpenCard(false);
    }

    const darBajaDebt = () => {
        paymentsC.darBajaDebt({ debtId: data.id, action: 'deactivate' })                                //Llamo al controlador para editar el curso
            .then((resp) => {
                handleOpenCard();
                if (resp.ok) {
                    setAlert({ message: resp.message, type: 'success', status: true });
                    console.log(resp)
                    let paysNew = pays.filter(dato => dato.id !== resp.data.id);
                    setPays(paysNew);
                } else {
                    setAlert({ message: resp.message, type: 'error', status: true });
                }
                setOpenModal({ open: false })
                handleOpenDialog({});
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const editDebtSould = () => {
        paymentsC.editDebtSould({ debtId: data.id, saldoPagado: amountConfirm, method: metodoPay })                                //Llamo al controlador para editar el curso
            .then((resp) => {
                handleOpenCard();
                if (resp.ok) {
                    setAlert({ message: resp.message, type: 'success', status: true });

                    let payIndex = pays.findIndex(pay => pay.id === resp.data.id);
                    let updatedData = pays.slice();

                    if (resp.data.saldo <= 0) {
                        updatedData.splice(payIndex, 1);
                    } else {
                        updatedData[payIndex].saldo = resp.data.saldo;
                    }

                    setPays(updatedData);
                    console.log(updatedData);

                } else {
                    setAlert({ message: resp.message, type: 'error', status: true });
                }
                setOpenModal({ open: false })
                handleOpenDialog({});
            })
            .catch((error) => {
                console.log(error)
            });
    }

    //======= VISTA =======
    return (
        <EstructuraV
            render={() => (
                <Grid item container className={classes.container} id='curses' align="center" alignContent="center">
                    <Grid component='h1' justifyContent='center' container item> PAGOS SIN FINALIZAR </Grid>
                    {/* Modal que verifica si quiere eliminar el item */}
                    <Dialog
                        open={openCard}
                        onClose={handleOpenDialog}
                        aria-labelledby="Esperando"
                        aria-describedby="Esprando a cargar la pagina"
                    >
                        <DialogTitle align="center">
                            <Grid container justifyContent='center'>
                                {openDeleteCard ?
                                    <Typography variant="h6" className={classes.txtDialogHeaderDelete}> Está seguro que desea dar de baja esta deuda? </Typography>
                                    :
                                    <Typography variant="h6" className={classes.txtDialogHeaderDelete}>  Modificar saldo</Typography>
                                }
                            </Grid>
                        </DialogTitle>
                        <DialogContent>
                            {!openDeleteCard &&
                                <Grid item container justifyContent='center' spacing={2} padding={3}>
                                    <Grid item >
                                        <TextField
                                            className={classes.inputDialog}
                                            label="Monto"
                                            variant="outlined"
                                            value={amountConfirm}
                                            onChange={handleChangeAmount}
                                            type="number"
                                            InputProps={{
                                                inputProps: {
                                                    min: 1, // Valor mínimo permitido
                                                    max: data.saldo, // Valor máximo permitido
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item >
                                        <TextField
                                            className={classes.inputDialog}
                                            label="Metodo de pago"
                                            variant="outlined"
                                            value={metodoPay}
                                            onChange={handleChangeMetodPay}
                                        />
                                    </Grid>
                                    {error &&
                                        <Typography>
                                            Por favor ingrese un monto válido
                                        </Typography>
                                    }
                                </Grid>
                            }
                            <Grid container spacing={8} alignItems="center" justifyContent='center'>
                                <Grid item align='center'>
                                    <Button
                                        variant='contained'
                                        className={classes.btnCancel}
                                        size='small'
                                        onClick={handleOpenDialog}
                                    >
                                        Cancelar
                                    </Button>
                                </Grid>
                                <Grid item align='center'>
                                    {
                                        openDeleteCard ? <Button
                                            className={classes.btnAceptDialog}
                                            variant='contained'
                                            size='small'
                                            onClick={() => saveChanges('baja')}
                                        >
                                            Aceptar
                                        </Button> :
                                            <Button
                                                className={classes.btnAceptDialog}
                                                variant='contained'
                                                size='small'
                                                onClick={() => saveChanges('edit')}
                                            >
                                                Aceptar
                                            </Button>
                                    }
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </Dialog>
                    <Grid item container justifyContent="center" className={classes.containerCards}>
                        {pays ? (
                            pays.map((item, index) => (
                                <Grid item key={index} xs={8} sm={7} md={5} lg={3} margin={3}>
                                    <Paper className={classes.cardContainer} elevation={12}>
                                        <Card className={classes.card} >
                                            <CardContent>
                                                <Grid container direction='column' spacing={1}>
                                                    <Grid item>
                                                        <Typography className={classes.subtitle}>
                                                            Fecha de inicio y fin
                                                        </Typography>
                                                        <Typography className={classes.titlesub} marginBottom={1}>
                                                            {dayjs(item.turns.date_turn_ini).format("DD/MM/YYYY")}  -   {dayjs(item.turns.date_turn_end).format("DD/MM/YYYY")}
                                                        </Typography>
                                                        <Typography className={classes.subtitle}>
                                                            Horario
                                                        </Typography>
                                                        <Typography className={classes.titlesub} marginBottom={2}>
                                                            {dayjs(item.turns.date_turn_ini).format("HH:mm:ss")}  -   {dayjs(item.turns.date_turn_end).format("HH:mm:ss")}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item component='h3'>
                                                        <Typography className={classes.subtitle}>
                                                            Alumno
                                                        </Typography>
                                                        <Typography className={classes.titlesub} >
                                                            {item.turns.user_alumn.name} {item.turns.user_alumn.lastname}
                                                        </Typography>
                                                        <Typography className={classes.titlesub} marginBottom={2}>{item.turns.user_alumn.email}</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container direction='column' spacing={1}>
                                                    <Grid item>
                                                        <Typography className={classes.subtitle}>
                                                            Curso
                                                        </Typography>
                                                        <Typography className={classes.titlesub} marginBottom={1}>
                                                            {item.turns.course.title}
                                                        </Typography>
                                                        <Typography className={classes.subtitle}>
                                                            Saldo a pagar restante
                                                        </Typography>
                                                        <Typography className={classes.titlesub}>
                                                            {item.saldo}$
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item container justifyContent='end'>
                                                        <Grid item marginRight={2}>
                                                            <Button
                                                                variant='contained'
                                                                className={classes.btnCancel}
                                                                size='small'
                                                                onClick={() => handleOpenDialog(item, 'baja')}

                                                            >
                                                                DAR DE BAJA
                                                            </Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button
                                                                variant='contained'
                                                                className={classes.btnAcept}
                                                                size='small'
                                                                onClick={() => handleOpenDialog(item, 'acreditar')}
                                                            >
                                                                ACREDITAR PAGO
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>


                                    </Paper>
                                </Grid>
                            )
                            )
                        ) : (
                            <Grid item container spacing={10} justifyContent="center" align="center">
                                <Grid item>
                                    <Skeleton variant="rectangular" animation="wave" className={classes.skeleton} />
                                </Grid>
                                <Grid item>
                                    <Skeleton variant="rectangular" animation="wave" className={classes.skeleton} />
                                </Grid>
                                <Grid item>
                                    <Skeleton variant="rectangular" animation="wave" className={classes.skeleton} />
                                </Grid>
                            </Grid>
                        )
                        }

                        {pays && (pays.length <= 0) ? (
                            <Grid>
                                <Typography>No se encontraron pagos pendientes</Typography>
                            </Grid>
                        ) : null}
                    </Grid >
                </Grid >
            )}
        />
    )
}

export default PaymentsV 