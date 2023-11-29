import React, { useCallback, useContext, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';

//============== COMPONENTES ==============
import EstructuraV from '../../../estructura/EstructuraV';
import { UserContext } from '../../../Providers/UserContext';
import CommentAnswerAlumnC from '../CommentAnswerAlumn_C/CommentAnswerAlumnC';
import CommentAnswerAlumnV from './CommentAnswerAlumnV';
import { Avatar, Box, Button, CircularProgress, Grid, Paper, Tab, TextField, Typography } from '@mui/material';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import { HomeContext } from '../../../Providers/HomeContext';
import { CachedOutlined } from '@mui/icons-material';
import Loading from '../../../estructura/Loading';

const useStyles = makeStyles((theme) => ({
  questionContainer: {
    width: '90%',
    background: theme.background.style1,
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
    fontSize: '0.8rem',
  },
  btnSend: {
    ...theme.button,
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
    },
    background: theme.background.style1,
  },
  backgroundColor:{
    background: theme.background.style1,
  },
}));

const controllerComAns = new CommentAnswerAlumnC();

const MainQuestionAlumnV = () => {

  //======= USE CONTEXT =======
  const { user, rol } = useContext(UserContext);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [questionAlumn, setQuestionAlumn] = useState('');
  const [questions, setQuestions] = useState(null);
  const [historyQuestions, setHistoryQuestions] = useState(null);
  const [value, setValue] = React.useState('2');
  const [search, setSearch] = useState(null);
  const { setAlert } = useContext(HomeContext);
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

  //busca preguntas por el id del instructor
  const getHistoryQuestions = () => {
    controllerComAns.getHistoryQuestion(user.id).then((resp) => {
      if (resp.ok) {
        console.log(resp)
        setHistoryQuestions(resp.data);
      }
    }).catch((error) => {
      console.error(error);
    })

    console.log('se ejecuto las history questions');
  }

  const handleChange = (e, newValue) => {
    if (newValue === '1' && !questions) {
      getQuestions();
    } else if (newValue === '3' && !historyQuestions) {
      getHistoryQuestions();
    }
    setValue(newValue);
  };

  //Funcion que crea la pregunta
  const handleCreateQuestion = () => {
    setLoadingBtn(true);
    if (questionAlumn !== '') {
      controllerComAns.createQuestion(user.id, questionAlumn)
        .then((resp) => {
          setQuestionAlumn('');
          setLoadingBtn(false);
          console.log(resp.data)
          if (resp.ok && resp.data.hasOwnProperty('newHistory')) {
            setQuestions(resp.data.newQuestions);
            setHistoryQuestions(resp.data.newHistory);
            setAlert({ message: resp.message, type: 'success', status: true });
          } else {
            setAlert({ message: resp.message, type: 'info', status: true });
          }
        })
        .catch((error) => {
          setLoadingBtn(false);
          setAlert({ message: 'Error en el servidor', type: 'error', status: true });
          console.error(error);
        });
    } else {
      setLoadingBtn(false);
      setAlert({ message: 'El campo está vacio!', type: 'error', status: true });
    }
  };

  const DataTab = ({ data, tab }) => {
    return (
      <>
        <Grid item marginLeft={2} className={classes.btnContainer}>
          <Button padding={2} variant="contained" onClick={() => setIniQuestions(tab)} className={classes.btnUpdate}>
            <CachedOutlined />
          </Button>
        </Grid >
        {
          data && data.length > 0 ? (
            <CommentAnswerAlumnV data={data} tab={tab} setSearch={setSearch} search={search} />
          ) : data && data.length === 0 ? (
            <Typography>No se encontraron preguntas.</Typography>
          ) : (
            <Loading text={'Buscando Preguntas'} />
          )
        }
      </>
    )
  };

  const setIniQuestions = (tab) => {
    switch (tab) {
      case 1:
        setQuestions(null);
        getQuestions();
        break;
      case 3:
        setHistoryQuestions(null);
        getHistoryQuestions();
        break;
      default: ; break;
    }
  }

  const viewAlumn = () => {
    return (
      <Box className={classes.tabAdmin} >
        <TabContext value={value}>
          <Box className={classes.boxTabAdmin}>
            <TabList onChange={handleChange} variant="scrollable" allowScrollButtonsMobile>
              <Tab label="Preguntas Respondidas" value="1" />
              <Tab label="Realizar pregunta" value="2" />
              <Tab label="Historial de Preguntas" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1" >
            <DataTab data={questions} tab={1} />
          </TabPanel>
          <TabPanel value="2">
            {
              <Grid item container justifyContent='center' >
                <Grid item xs={12} sm={10} md={9} lg={6} justifyContent='center'>
                  <Paper elevation={12} className={classes.questionPaper} style={{ borderLeft: `5px solid red` }}>
                    <Grid item container direction='column' xs={12} justifyContent='center' >
                      <Grid item marginBottom={1}>
                        <Grid item container>
                          <Grid item container xs={6} className={classes.avatarContainer}  >
                            <Avatar />
                          </Grid>
                          <Grid item container xs={6} justifyContent='end'>
                            <Typography style={{ color: `red` }} className={classes.time} >
                              {new Date()
                                .toLocaleDateString('es-AR', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              }
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item container direction='column' xs={12} justifyContent='center'>
                        <Grid item>
                          <Typography className={classes.titleQuestion}>Pregunta</Typography>
                          <Grid container justifyContent='space-between'>
                            <Grid item container xs={12} marginBottom={1}>
                              <TextField
                                id='pregunta'
                                color="letters"
                                label="Respuesta"
                                variant="filled"
                                fullWidth
                                value={questionAlumn}
                                onChange={(e) => setQuestionAlumn(e.target.value)}
                                multiline
                                rows={4}
                                required
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} justifyContent='center'>
                        {loadingBtn ? (
                          <Grid item>
                            <CircularProgress />
                          </Grid>
                        ) : (
                          <Button onClick={handleCreateQuestion} className={classes.btnSend} variant="contained">
                            Enviar Pregunta
                          </Button>
                        )
                        }
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid >
              </Grid >
            }
          </TabPanel>
          <TabPanel value="3">
            <DataTab data={historyQuestions} tab={3} />
          </TabPanel>
        </TabContext>
      </Box>
    )
  }

  useEffect(() => {
    if (!rol.alumn) {
      getQuestions();
    }
  }, [rol.alumn, getQuestions]);
  //======= VISTA =======
  return (
    <EstructuraV
      render={() => (
        rol.alumn || questions ? (
          rol.alumn ? (
            viewAlumn()
          ) : (
            <Grid container direction='column' padding={2} className={classes.backgroundColor}>
              <DataTab data={questions} tab={1} />
            </Grid>
          )
        ) : questions && questions.length === 0 ? (
          <Grid item container justifyContent='center'>
            <Grid item className={classes.questionContainer}>
              <Paper elevation={12} className={classes.questionPaper} style={{ borderLeft: `5px solid red` }}>
                <Typography>No se encontraron preguntas, vuelve mas tarde.</Typography>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Loading text={'Cargando...'} />
        )
      )}
    />
  )
}

export default MainQuestionAlumnV
