import React, { memo, useContext, useState } from 'react';
import { Autocomplete, Avatar, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

//============== COMPONENTES ==============
import CommentAnswerAlumnC from '../CommentAnswerAlumn_C/CommentAnswerAlumnC';
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
    width: '100%',
    height: '100%',
  },
  cardContainer: {
    marginTop: theme.spacing(0),
  },
  time: {
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
  questionNotResp: {
    fontStyle: 'italic',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '30px',
    display: 'inline-block',
    padding: '3px 5px',
  },
}));


//controlador
const controllerComAns = new CommentAnswerAlumnC();

const CommentAnswerAlumnV = memo(({ data, tab, setSearch, search }) => {

  //======= VARIABLE ESTILOS =======
  const classes = useStyles();

  //======= USE CONTEXT =======
  const { setOpenModal, setAlert } = useContext(HomeContext);

  //======= USE STATE =======

  const [questions] = useState(data); //preguntas envidas desde el main

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [searchQuestion, setSearchQuestion] = useState('');
  const [borderColor] = useState(['#3f51b5', '#B55B3F', '#b53fb3']);//colore
  const color = borderColor[tab - 1];

  // Funcion que busca la pregunta en la base de datos
  const handleSelectQuestion = (e, newValue) => {
    if (typeof newValue === 'undefined') {
      setOpenModal({ message: 'Cargando...', title: 'Porfavor aguarde', subTitle: '', open: true, loading: true });
      controllerComAns.serachQuestion(searchQuestion)
        .then((resp) => {
          if (resp.ok) {
            setSearch(resp.data);
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
          <Paper elevation={12} className={classes.questionPaper} style={{ borderLeft: `5px solid ${question.answer ? color : 'red'}` }}>
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
                  <Typography>{question.answer ? question.answer : <Typography className={classes.questionNotResp}>Sin responder</Typography>}</Typography>
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
              onKeyDown={(e) => {
                setSearchQuestion(e.target.value)
              }
              }
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
              setSearch(null)
              setSearchQuestion('')
            }}>
              Eliminar busqueda
            </Button>
          </Grid>
        }
      </Grid>
      <Grid item container spacing={2} className={classes.cardContainer}>
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
})

export default CommentAnswerAlumnV
