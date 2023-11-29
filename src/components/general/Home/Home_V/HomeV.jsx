import React, { useContext, useEffect } from 'react';
import { Grid } from '@mui/material';
import AOS from "aos";
//============== CSS AOS ==============
import "aos/dist/aos.css";

//============== COMPONENTES ==============
import EstructuraV from '../../../estructura/EstructuraV';
import InicioV from './InicioV';
import BenefitsV from './BenefitsV';
import CarrouselV from './CarrouselV';
import CoursesV from './CoursesV';
import HowToFindV from './HowToFindV';
import ContactV from './ContactV';
import UsV from './UsV';
import { HomeContext } from '../../../Providers/HomeContext';

const HomeV = () => {

  //======= USE CONTEXT =======
  const { setActualizar } = useContext(HomeContext);

  useEffect(() => {
    //console.log('actualizar')
    setActualizar(true);
  }, [setActualizar]);


  //======= USE EFFECT =======
  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 120,
      delay: 100,
      once: true,
    });
    AOS.refresh();
  }, []);


  //======= VISTA =======
  return (
    <EstructuraV
      render={() => (
        <Grid container direction="column">
          <InicioV />
          <BenefitsV />
          <CarrouselV />
          <CoursesV />
          <UsV />
          <HowToFindV />
          <ContactV />
        </Grid>
      )}
    />
  )
}

export default HomeV
