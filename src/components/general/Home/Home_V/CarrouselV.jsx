import React, { useContext } from 'react'

//============== COMPONENTES ==============
import { Grid, Skeleton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Flickity from 'react-flickity-component'
import "flickity/css/flickity.css";
import { HomeContext } from '../../../Providers/HomeContext';

const {
  REACT_APP_URL_STORAGE,
} = process.env;


//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({
  container: {
    background: theme.background.style4,
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
  },
  img: {
    width: '100%',
    objectFit: 'contain',
    height: '700px',
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
  }
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

const CarrouselV = () => {

    //======= USE CONTEXT =======
    const { carrousel } = useContext(HomeContext);

    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    //======= VISTA =======
    return (
      <Grid className={classes.container} id='carrusel'>
        {carrousel ? (
          <Flickity
            elementType={'div'}
            options={flickityOptions}
            reloadOnUpdate
            static
          >
            {carrousel.map((item, index) => (
              <Grid key={index} className={classes.containerImg}>
                <img src={REACT_APP_URL_STORAGE + item.url} className={classes.img} alt={item.description} />
              </Grid>
            ))
            }
          </Flickity>
        ) : (
          <Skeleton variant="rectangular" animation="wave" className={classes.skeleton} />
        )
        }
      </Grid>
    )
  }

export default CarrouselV
