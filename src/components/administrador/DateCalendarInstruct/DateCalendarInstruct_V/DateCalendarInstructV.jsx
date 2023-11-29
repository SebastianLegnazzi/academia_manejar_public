import React, { useState } from 'react'

//============== COMPONENTES ==============
import { Box, Grid, Tab } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import EstructuraV from '../../../estructura/EstructuraV';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import CalendarV from './CalendarV';
import InstructV from './InstructV';

//import EditCarrouselC from '../EditCarrousel_C/EditCarrouselC';

//============== ESTILOS MUI ==============
const useStyles = makeStyles((theme) => ({

}));


const DateCalendarInstructV = () => {

  //======= USE STATE =======
  const [value, setValue] = useState('1');

  //======= USE CONTEXT =======
  //const { } = useContext(HomeContext);


  //============ FUNCIONES =================
  const handleChange = (e, newValue) => {
    setValue(newValue);
  };


  //======= VARIABLE ESTILOS =======
  const classes = useStyles();

  //======= VISTA =======
  return (
    <EstructuraV
      render={() => (
        <Grid container direction="column">
          <Box className={classes.tabAdmin}>
            <TabContext value={value}>
              <Box className={classes.boxTabAdmin}>
                <TabList onChange={(event, newValue) => handleChange(event, newValue)} variant="scrollable" allowScrollButtonsMobile>
                  <Tab label="Horarios del Calendario" value="1" />
                  <Tab label="Horarios del Instructor" value="2" />
                </TabList>
              </Box>
              <TabPanel style={{padding: '0px'}} value="1">
                <CalendarV />
              </TabPanel>
              <TabPanel value="2">
                <InstructV />
              </TabPanel>
            </TabContext>
          </Box >
        </Grid>
      )}
    />
  )


}

export default DateCalendarInstructV
