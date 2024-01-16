import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'

import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'
import { AppBar, Typography, Grid } from '@material-ui/core'
// constants
import { APP_TITLE } from '../utils/constants'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundImage: `url(../../IceHex.jpg)`,
            backgroundPosition: 'fixed',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            height: '100vh',
            width: '100vw',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            background: '#ffffff',
            borderBottom: '4px solid' + theme.palette.primary.main,
            height: '11%'
        },
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            width: '100vh',
            margin: 'auto',
            alignItems: "center",
            justifyContent: "space-between",
        },
        logo: {
            maxWidth: 160,
        },
        signupBtn: {
            marginTop: '40vh',
            flexGrow: 1,
            background: 'red',
            width: '10vw',
            position: 'relative',
        },
        loginBtn: {
            marginTop: '40vh',
            flexGrow: 1,
            background: 'red',
            width: '10vw',
            position: 'relative',
        },
        card: {
            marginTop: theme.spacing(10),
        },
        text: {
            color: theme.palette.text.primary,
            padding: '10px 0px 10px 10px'
        }
    })
)

const HomePage = () => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <AppBar
                position="fixed"
                elevation={1}
                className={clsx(classes.appBar)}
            >
                <Typography variant="h4" noWrap className={classes.text}>
                    {APP_TITLE}
                </Typography>
            </AppBar>
            <Grid className={classes.container} container>
                <Link to={{ pathname: '/register' }}>
                    <Button
                        variant="contained"
                        size="large"
                        color="secondary"
                        className={classes.signupBtn}
                    >
                        Sign Up
                    </Button>
                </Link>
                <Link to={{ pathname: '/login' }}>
                    <Button
                        variant="contained"
                        size="large"
                        color="secondary"
                        className={classes.loginBtn}
                    >
                        Login
                    </Button>
                </Link>
            </Grid>
        </div>
    )
}

export default HomePage