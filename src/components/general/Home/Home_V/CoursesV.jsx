import React, { useContext } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { InfoOutlined } from '@mui/icons-material';
import {
    Grid,
    List, ListItem,
    Card,
    CardContent,
    Typography,
    CardMedia,
    Paper,
    Skeleton,
    Button
} from '@mui/material';
import { HomeContext } from '../../../Providers/HomeContext';
import { CalendarContext } from '../../../Providers/CalendarContext';
import { UserContext } from '../../../Providers/UserContext';
import { Link } from 'react-router-dom';
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
        color: theme.palette.letters.color5,
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
    reservar: {
        backgroundColor: theme.palette.btn.color1,
        color: 'white',
        '&:hover': {
            backgroundColor: theme.palette.btn.color1H,
        },
    }
}));

const CoursesV = () => {

    //======= USE CONTEXT =======
    const { courses } = useContext(HomeContext);
    const { setCourse } = useContext(CalendarContext);
    const { user } = useContext(UserContext);


    const handleCourse = (course) => {
        setCourse(course);
        localStorage.setItem('course', course.id);
    };

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //======= VISTA =======
    return (
        <Grid item container className={classes.container} id='curses' align="center" alignContent="center">
            <Grid item container spacing={2} justifyContent="center">
                {courses ? (
                    courses.map((item, index) => (
                        <Grid item key={index} xs={12} md={6} lg={5}>
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
                                        <Grid >
                                            <Typography className={classes.title} >
                                                {item.title}
                                            </Typography>
                                            <Typography variant="h6" className={classes.price}>$ {item.price}</Typography>
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
                                        <Grid justifyContent="center">
                                            {user ? (
                                                <Link to={'turn'}>
                                                    <Button
                                                        variant='contained'
                                                        className={classes.reservar}
                                                        size='large'
                                                        // disabled={error}
                                                        onClick={() => handleCourse(item)}
                                                    >
                                                        Reservar Curso
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Link to={'register'}>
                                                    <Button
                                                        variant='contained'
                                                        className={classes.reservar}
                                                        size='large'
                                                        // disabled={error}
                                                        onClick={() => handleCourse(item)}
                                                    >
                                                        Registrarse para reservar
                                                    </Button>
                                                </Link>
                                            )
                                            }
                                        </Grid>
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
            </Grid>
        </Grid >
    )
}

export default CoursesV 