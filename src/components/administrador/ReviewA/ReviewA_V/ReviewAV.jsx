import React, { useContext, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import EstructuraV from '../../../estructura/EstructuraV';
import { UserContext } from '../../../Providers/UserContext';
import { Box, Collapse, Grid, IconButton, Paper, Rating, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Loading from '../../../estructura/Loading';
import dayjs from 'dayjs';
import ReviewAC from '../ReviewA_C/ReviewAC';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

//============== COMPONENTES ==============
const useStyles = makeStyles((theme) => ({
    container: {
        padding: '10px 5px',
    },
    tableContainer: {
        padding: '10px 5px',
    },
    celdaTable: {
        width: '10% !important',
        padding: '0px important',
        margin: '0px important',
    },

    iconExpand: {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    titleExpand: {
        fontSize: '20px',
        fontWeight: 'bold',
    }
}));

const controllerReview = new ReviewAC();

const ReviewAV = () => {
    const columns = [
        { id: 'instructor', label: 'Instructor' },
        { id: 'alumno', label: 'Alumno' },
        // { id: 'fecha de fin', label: 'Fecha de fin' },
        { id: 'Puntaje', label: 'Puntaje' }
    ];

    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [expandedRows, setExpandedRows] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (rowId) => {
        const newExpandedRows = expandedRows.includes(rowId)
            ? expandedRows.filter((id) => id !== rowId)
            : [...expandedRows, rowId];
        setExpandedRows(newExpandedRows);
    };

    //======= USE STATES =======
    const [reviews, setReviews] = useState(null);
    const [textLoading, setTextLoading] = useState('Buscando reseñas hechas');
    const [filteredReviews, setFilteredReviews] = useState([]);

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    useEffect(() => {
        if (!reviews) {
            controllerReview.getReviews({})
                .then((data) => {
                    if (data.ok) {
                        console.log(data.data);
                        setReviews(data.data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [reviews]);

    useEffect(() => {
        if (reviews) {
            const filteredData = reviews.filter((row) =>
                Object.values(row).some((value) =>
                    value.toString().toLowerCase().includes(searchText.toLowerCase())
                )
            );
            setFilteredReviews(filteredData);
        }
    }, [reviews, searchText]);

    //======= VISTA =======
    return (
        <EstructuraV
            render={() => (
                <Grid container spacing={1} justifyContent='space-evenly' className={classes.container}>
                    <Grid item xs={12}>
                        <Typography variant='h4' component='div' align='center'>
                            Reseñas
                        </Typography>
                    </Grid>
                    <Grid>
                        <TextField
                            label="Buscar"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    {reviews ? (
                        <>
                            <Grid container justifyContent="center">
                                <Grid item xs={11} sm={11} md={11} lg={11}>
                                    <Paper>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell />
                                                        {columns.map((column, index) => (
                                                            <TableCell key={index}>{column.label}</TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {filteredReviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                                        <React.Fragment key={row.id}>
                                                            <TableRow onClick={() => handleRowClick(row.id)}>
                                                                <TableCell className={classes.celdaTable}>
                                                                    <IconButton size="small" className={classes.iconExpand}>
                                                                        {expandedRows.includes(row.id) ? (
                                                                            <KeyboardArrowUpIcon />
                                                                        ) : (
                                                                            <KeyboardArrowDownIcon />
                                                                        )}

                                                                    </IconButton>
                                                                </TableCell>
                                                                <TableCell>{row.instructorName}</TableCell>
                                                                <TableCell>{row.alumnName}</TableCell>
                                                                <TableCell>
                                                                    <Box component="fieldset" mb={3} borderColor="transparent">
                                                                        <Rating
                                                                            name="read-only"
                                                                            value={row.score}
                                                                            precision={0.5}
                                                                            readOnly
                                                                        />
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow  >
                                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 1}>
                                                                    <Collapse in={expandedRows.includes(row.id)} timeout="auto" unmountOnExit >
                                                                        <Grid container justifyContent='space-evenly' paddingTop={2} paddingBottom={2}>
                                                                            <Grid item xs={7} sm={5} >
                                                                                <Typography variant="body2" color="textSecondary" component="div">
                                                                                    <span className={classes.titleExpand}>Comentario:</span> {row.comment}
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid item xs={7} sm={5}>
                                                                                <Typography variant="body2" color="textSecondary" component="div">
                                                                                    <span className={classes.titleExpand}>Curso:</span> {row.courseTitle}
                                                                                </Typography>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Collapse>
                                                                </TableCell>
                                                            </TableRow>
                                                        </React.Fragment>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                            component="div"
                                            count={filteredReviews.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </Paper>
                                </Grid>
                            </Grid>

                        </>
                    ) : (
                        <Grid>
                            <Paper>
                                <Loading text={textLoading} />
                            </Paper>
                        </Grid>
                    )
                    }
                </Grid>
            )}
        />
    )
}


export default ReviewAV
