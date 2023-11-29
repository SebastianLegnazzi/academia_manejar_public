import React, { useCallback, useContext, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';

//============== COMPONENTES ==============
import EstructuraV from '../../../estructura/EstructuraV';
import { UserContext } from '../../../Providers/UserContext';
import CommentAnswerInstrC from '../CommentAnswerInstr_C/CommentAnswerInstrC';
import CommentAnswerInstrV from './CommentAnswerInstrV';
import { Box, Button, CircularProgress, Grid, Paper, Tab, Typography } from '@mui/material';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import { CachedOutlined } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
  questionContainer: {
    width: '90%',
  },
  tabAdmin: {
    width: '100%',
    typography: 'body1',
  },
  boxTabAdmin: {
    borderBottom: '1px solid #e8e8e8',
  },
  questionPaper: {
    padding: theme.spacing(2),
  },
  avatarContainer: {
    width: '100%',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      marginBottom: theme.spacing(2),
    },
  },
  cardContainer: {
    marginTop: theme.spacing(0),
  },
  time: {
    padding: '0.4rem 1.9rem',
    color: 'white',
    borderRadius: '100px',
    fontSize: '0.8rem',
  },
  btnUpdate: {
    ...theme.button,
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '10px 30px',

    [theme.breakpoints.down('md')]: {
      position: 'relative',
      padding: '10px 50px',
    }
  },
  btnContainer: {
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      justifyContent: 'center',
    }
  }
}));

const controllerComAns = new CommentAnswerInstrC();

const MainQuestionV = () => {

  //======= USE CONTEXT =======
  const { user, rol } = useContext(UserContext);
  const [questions, setQuestions] = useState(null);
  const [pendingQuestions, setPendingQuestions] = useState(null);
  const [historyQuestions, setHistoryQuestions] = useState(null);
  const [search, setSearch] = useState(null);
  const [value, setValue] = useState('2');

  //======= VARIABLE ESTILOS =======
  const classes = useStyles();

  //Busco preguntas respondidas
  const getQuestions = useCallback(() => {
    controllerComAns.getQuestions()
      .then((resp) => {
        if (resp.ok) {
          setQuestions(resp.data);
        }
      }).catch((error) => {
        console.error(error);
      })

    console.log('se ejecuto questions');
  }, [])

  //Busco preguntas pendientes
  const getPendingQuestions = useCallback(() => {
    controllerComAns.getPendingQuestion(user.id)
      .then((resp) => {
        if (resp.ok) {
          setPendingQuestions(resp.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    console.log('se ejecuto pending questions');
  }, [setPendingQuestions, user.id])

  //busca preguntas por el id del instructor
  const getHistoryQuestions = () => {
    controllerComAns.getHistoryQuestion(user.id).then((resp) => {
      if (resp.ok) {
        setHistoryQuestions(resp.data);
      }
    }).catch((error) => {
      console.error(error);
    })

    console.log('se ejecuto las history questions');
  }

  //Busco preguntas recientes
  useEffect(() => {
    if (!questions) {
      getPendingQuestions();
    }
  }, [questions, getPendingQuestions, getQuestions]);  // Incluir las dependencias


  //Componente de carga
  const loading = (text) => (
    <Grid item container justifyContent='center' alignContent='center'>
      <Grid item className={classes.questionContainer}>
        <Grid container justifyContent='center' alignItems='center' spacing={2}>
          <Grid item>
            <Typography>
              {text}
            </Typography>
          </Grid>
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )

  const handleChange = (e, newValue) => {
    // setQuestions(null);
    // setPendingQuestions(null);
    // setHistoryQuestions(null);

    if (newValue === '1' && !questions) {
      getQuestions();
    } else if (newValue === '3' && !historyQuestions) {
      getHistoryQuestions();
    } else if (newValue === '2' && !pendingQuestions) {
      getPendingQuestions();
    }
    setValue(newValue);
  };

  const DataTab = ({ data, tab, funcion1, funcion2, funcion3 }) => {
    return (
      <>
        <Grid item marginLeft={2} className={classes.btnContainer}>
          <Button padding={2} variant="contained" onClick={() => setIniQuestions(tab)} className={classes.btnUpdate}>
            <CachedOutlined />
          </Button>
        </Grid >
        {
          data && data.length > 0 ? (
            <CommentAnswerInstrV data={data} tab={tab} setQuestionsIni={funcion1} setQuestionsTotal={funcion2} setQuestionsEdit={funcion3} setSearch={setSearch} search={search} />
          ) : data && data.length === 0 ? (
            <Typography>No se encontraron preguntas.</Typography>
          ) : (
            loading('Buscando preguntas...')
          )
        }
      </>
    )
  };

  const setIniQuestions = (tab) => {
    switch (tab) {
      case 1: setQuestions(null); 
              getQuestions(); 
              break;
      case 2: setPendingQuestions(null); 
              getPendingQuestions();   
              break;
      case 3: setHistoryQuestions(null); 
              getHistoryQuestions(); 
              break;
      default: ; break;
    }
  }

  const viewAdmin = () => {
    return (
      <Box className={classes.tabAdmin}>
        <TabContext value={value}>
          <Box className={classes.boxTabAdmin}>
            <TabList onChange={(event, newValue) => handleChange(3, newValue)} variant="scrollable" allowScrollButtonsMobile>
              <Tab label="Preguntas Respondidas" value="1" />
              <Tab label="Preguntas Sin Responder" value="2" />
              <Tab label="Historial de Preguntas" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
              <DataTab data={questions} tab={1} />
          </TabPanel>
          <TabPanel value="2">
            <DataTab data={pendingQuestions} tab={2} funcion1={setPendingQuestions} funcion2={setQuestions} funcion3={setHistoryQuestions} />
          </TabPanel>
          <TabPanel value="3">
            <DataTab data={historyQuestions} tab={3} funcion1={setHistoryQuestions} funcion2={setQuestions} />
          </TabPanel>
        </TabContext>
      </Box >
    )
  }

  //======= VISTA =======
  return (
    <EstructuraV
      render={() => (
        viewAdmin()
      )}
    />
  )
}

export default MainQuestionV
