import React, { useContext, useEffect, useState } from 'react';
import { Autocomplete, Avatar, Button, CircularProgress, Grid, Paper, TextField, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { CachedOutlined } from '@mui/icons-material';

//============== COMPONENTES ==============
import { UserContext } from '../../../Providers/UserContext';
import CommentAnswerInstrC from '../CommentAnswerInstr_C/CommentAnswerInstrC';
import { HomeContext } from '../../../Providers/HomeContext';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
  inputContainer: {
    width: '30%',
    [theme.breakpoints.down('lg')]: {
      width: '80%',
    },
  },
  questionPaper: {
    padding: theme.spacing(2),
  },
  questionContainer: {
    width: '90%',
  },
  avatarContainer: {
    // width: '100%',
    height: '100',
    [theme.breakpoints.down('md')]: {
      // marginBottom: theme.spacing(2),
    },
  },
  cardContainer: {
    marginTop: theme.spacing(0),
  },
  time: {
    // padding: '0.4rem 1.9rem',
    fontSize: '0.8rem',
  },
  btnSearch: {
    background: theme.palette.letters.main,
    color: 'white',
    padding: '0.6rem 2rem',
    borderRadius: '100px',
    '&:hover': {
      background: '#054200',
    },
  },
  btnDelete: {
    background: '#BD0003',
    color: 'white',
    padding: '0.6rem 2rem',
    borderRadius: '100px',
    marginLeft: theme.spacing(1),
    '&:hover': {
      background: '#8a0002',
    },
  },
  titleQuestion: {
    fontStyle: 'italic',
    color: '#a1a1a1',
  },
  skTxt: {
    width: '700px',
    [theme.breakpoints.down('lg')]: {
      width: '800px',
      height: '200px',
    },
    [theme.breakpoints.down('md')]: {
      width: '500px',
      height: '200px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '240px',
    },
    height: '100%',
  },
}));

//controlador
const controllerComAns = new CommentAnswerInstrC();
const CommentAnswerInstrV = ({ data, tab, setQuestionsIni, setQuestionsTotal, setQuestionsEdit, setSearch, search }) => {

  //======= VARIABLE ESTILOS =======
  const classes = useStyles();

  //======= USE CONTEXT =======
  const { user } = useContext(UserContext);
  const { setOpenModal, setAlert } = useContext(HomeContext);

  //======= USE STATE =======
  const [questions, setQuestions] = useState(data); //preguntas envidas desde el main

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [searchQuestion, setSearchQuestion] = useState('');

  //para poder mostrar bien los datos de las cardss
  const [responses, setResponses] = useState(Array(data.length).fill(''));  //para responder
  const [responding, setResponding] = useState(Array(data.length).fill(true));  //para habilitar o deshabilitar los botones
  const [loadings, setLoadings] = useState(Array(data.length).fill(false));

  const [borderColor] = useState(['#3f51b5', '#B55B3F', '#b53fb3']);//colore
  const color = borderColor[tab - 1];

  //si el tab es 3 todos los inputs pasan a ser las questions.answer
  useEffect(() => {
    if (tab === 3 && responses.length !== 0) {
      setResponses(questions.map(question => question.answer));
    }
  }, [tab, questions]);

  //cambia el input de respuesta
  const handleResponseChange = (index, value) => {
    const arrayResponses = [...responses];
    arrayResponses[index] = value;
    setResponses(arrayResponses);
  };

  //cambia el circulito de cargando
  const handleLoadingChange = (index) => {
    const arrayResponses = [...loadings];
    arrayResponses[index] = !arrayResponses[index];
    setLoadings(arrayResponses);
  };

  //cambia botones de guardar o responder 
  const handleSetResponding = (index) => {
    const updatedResponding = [...responding];
    updatedResponding[index] = !updatedResponding[index];
    setResponding(updatedResponding);
  }

  //se encarga de guardar la respuesta de guardado o edicion
  const saveResponse = (index, idQuestion, action) => {
    if (action === 'guardar') { handleLoadingChange(index) }; //si la funcion es guardar muestra el circulito rodando
    let respuesta; //si la accion es distinta de guardar y el tab es 2 setea la respuesta en null
    let enviar = true;

    if (action !== 'guardar' && tab === 2) {
      respuesta = null;
    } else {
      respuesta = responses[index];
      if (respuesta.trim().length <= 0 && action === 'guardar') {
        console.log('ols')
        enviar = false;
        setAlert({ message: 'Debe ingresar alguna frase', type: 'error', status: true }); //muestra un alerta 
        setResponding(Array(data.length).fill(true)); //inicializa los botones
        setLoadings(Array(data.length).fill(false)); //inicializa circulitos cargando
        if (tab === 3) {
          setResponses(questions.map(question => question.answer));
        }
      }
    }

    let type = tab === 2 ? 'guardar' : 'edicion';

    if (enviar) {
      controllerComAns.responseQuestion(user.id, idQuestion, respuesta, type).then(resp => {
        if (resp.ok) {
          if (action === 'guardar') {
            setAlert({ message: resp.message, type: 'success', status: true }); //muestra un alerta 
            setResponding(Array(data.length).fill(true)); //inicializa los botones
            setLoadings(Array(data.length).fill(false)); //inicializa circulitos cargando

            if (tab === 2) {
              setQuestions(resp.data); //si es el tab 2 (responder) inicializa todas las preguntas
              setResponses(Array(data.length).fill('')); //inicializa todos los inputs
              setQuestionsEdit(null);
            } else if (tab === 3) {
              console.log(resp.data);
            }
            console.log(resp.data);
            setQuestionsIni(resp.data);
            setQuestionsTotal(null);

          }
        } else {
          setAlert({ message: resp.message, type: 'error', status: true });
        }
      }).catch((error) => {
        console.error(error);
        setOpenModal({ open: false });
        setAlert({ message: error, type: 'error', status: true });
      });
    }

  }

  // Funcion que busca la pregunta en la base de datos
  const handleSelectQuestion = (e, newValue) => {
    if (typeof newValue === 'undefined') {
      setOpenModal({ message: 'Cargando...', title: 'Porfavor aguarde', subTitle: '', open: true, loading: true });
      controllerComAns.serachQuestion(searchQuestion)
        .then((resp) => {
          if (resp.ok && resp.data.length > 0) {
            setAlert({ message: resp.message, type: 'success', status: true });
          } else {
            setAlert({ message: resp.message, type: 'error', status: true });
          }
          setOpenModal({ open: false });

        }).catch((error) => {
          console.error(error);
          setOpenModal({ open: false });
          setAlert({ message: error, type: 'error', status: true });
        })
    } else {
      setSelectedQuestion(newValue);
    }
  };

  //vista para cada una de las cards con su pregunta y respuesta
  const viewQuestion = (question, index) => {
    return (
      <Grid key={index} item container md={5} lg={4} justifyContent='space-around' >
        <Grid item className={classes.questionContainer}>
          <Paper elevation={12} className={classes.questionPaper} style={{ borderLeft: `5px solid ${color}` }}>
            <Grid item container direction='column' xs={12} justifyContent='center' >
              <Grid item marginBottom={1}>
                <Grid item container>
                  <Grid item container xs={6} className={classes.avatarContainer}  >
                    <Avatar />
                  </Grid>
                  <Grid item container xs={6} justifyContent='end'>
                    <Typography style={{ color: `${color}` }} className={classes.time} >
                      {new Date(question.created_at)
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
                  <Typography>{question.question}</Typography>
                </Grid>

                <Grid item>
                  <Typography className={classes.titleQuestion}>Respuesta</Typography>
                  {
                    tab === 1 ? (
                      <Typography>{question.answer}</Typography>
                    ) : (
                      <Grid item container>
                        <Grid item container xs={12} marginRight={2}>
                          <TextField
                            id={`response-${index}`}
                            color="letters"
                            label="Respuesta"
                            variant="filled"
                            fullWidth
                            value={responses[index]}
                            disabled={responding[index]}
                            onChange={(e) => {
                              handleResponseChange(index, e.target.value);
                            }}
                            rows={5}
                            multiline
                          />
                        </Grid>

                        {loadings[index] ? (
                          <Grid item container xs={12} justifyContent={'center'} marginTop={2}>
                            <CircularProgress />
                          </Grid>
                        ) : (
                          <Grid item container xs={12} justifyContent={'center'} marginTop={2}>
                            {
                              responding[index] ? (
                                <Button onClick={() => {
                                  handleSetResponding(index, question.id);
                                  saveResponse(index, question.id, 'reservar');  // Llama a otra función aquí
                                }} padding={3} variant="contained">
                                  {tab === 3 ? (
                                    <Typography>Editar</Typography>
                                  ) : (
                                    <Typography>Responder</Typography>
                                  )}
                                </Button>
                              ) : (
                                <Button onClick={() => saveResponse(index, question.id, 'guardar')} onKeyPress={(e) => { if (e.key === 'Enter') { } }} variant="contained"><Typography>Guardar</Typography></Button>
                              )
                            }
                          </Grid>
                        )
                        }
                      </Grid>
                    )
                  }
                </Grid>
              </Grid>

            </Grid>
          </Paper>
        </Grid >
      </Grid >
    )
  };

  //======= VISTA =======
  return (
    <Grid container alignContent='center' direction="column" className={classes.container}>
      <Grid item container justifyContent='center' alignItems='center' spacing={2}>
        <Grid item className={classes.inputContainer}>
          <Paper elevation={8}>
            <Autocomplete
              options={questions}
              getOptionLabel={(option) => option.question}
              value={selectedQuestion}
              onChange={handleSelectQuestion}
              onKeyDown={(e) => setSearchQuestion(e.target.value)}
              noOptionsText={
                <Button variant='contained' className={classes.btnSearch} onClick={handleSelectQuestion}>
                  No se encontró la pregunta, buscar en preguntas antiguas
                </Button>
              }
              renderInput={(params) => <TextField {...params} label="Seleccionar pregunta" color='letters' />}
            />
          </Paper>
        </Grid>
        {search &&
          <Grid item>
            <Button variant='contained' className={classes.btnDelete} onClick={() => {
              setSearchQuestion('')
              setSearch(null)
            }}>
              Eliminar busqueda
            </Button>
          </Grid>
        }
      </Grid>
      <Grid item container spacing={2} justifyContent='center' className={classes.cardContainer}>
        {selectedQuestion ? (
          viewQuestion(selectedQuestion, 1)
        ) : search ? (
          search.map((question, index) => {
            return (
              viewQuestion(question, index)
            )
          })
        ) : (
          questions.map((question, index) => {
            return (
              viewQuestion(question, index)
            )
          })
        )}
      </Grid>
    </Grid >
  )
}

export default CommentAnswerInstrV
