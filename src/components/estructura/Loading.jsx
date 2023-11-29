
import { CircularProgress, Grid, Typography } from '@mui/material';
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';


const useStyles = makeStyles((theme) => ({
    loading: {
        width: '100%',
    },
}));

const Loading = ({ text }) => {
    //======= VARIABLE ESTILOS =======
    const classes = useStyles();

    return (
        <Grid item container justifyContent='center' alignContent='center'>
            <Grid item className={classes.loading}>
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
}

export default Loading
