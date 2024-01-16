import React, { useReducer, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import Button from '@material-ui/core/Button'
import axios from 'axios'
// import jwt_decode from 'jwt-decode'

// constants
import { API_GENERAL_USER_LOG_IN } from '../utils/constants'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundImage: `url(../../Login_Register.jpg)`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            height: '100vh',
            width: '100vw',
        },
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            width: 400,
            margin: 'auto',
        },
        loginBtn: {
            marginTop: theme.spacing(2),
            flexGrow: 1,
        },
        header: {
            textAlign: 'center',
            background: '#d80404',
            color: '#fff',
        },
        card: {
            marginTop: '25vh',
            width: '23.5vw',
            borderRadius: 15,
        },
    })
)

//state type

interface State {
    Email: string,
    password: string,
    username: string,
    isButtonDisabled: boolean,
    helperText: string,
    isError: boolean,
}

const initialState: State = {
    Email: '',
    password: '',
    username: '',
    isButtonDisabled: true,
    helperText: '',
    isError: false,
}

type Action =
    | { type: 'setEmail'; payload: string }
    | { type: 'setPassword'; payload: string }
    | { type: 'setUsername'; payload: string }
    | { type: 'setIsButtonDisabled'; payload: boolean }
    | { type: 'loginSuccess'; payload: string }
    | { type: 'loginFailed'; payload: string }
    | { type: 'setIsError'; payload: boolean }

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'setEmail':
            return {
                ...state,
                Email: action.payload,
            }
        case 'setPassword':
            return {
                ...state,
                password: action.payload,
            }
        case 'setUsername':
            return {
                ...state,
                username: action.payload,
            }
        case 'setIsButtonDisabled':
            return {
                ...state,
                isButtonDisabled: action.payload,
            }
        case 'loginSuccess':
            return {
                ...state,
                helperText: action.payload,
                isError: false,
            }
        case 'loginFailed':
            return {
                ...state,
                helperText: action.payload,
                isError: true,
            }
        case 'setIsError':
            return {
                ...state,
                isError: action.payload,
            }
    }
}

const Login = () => {
    const classes = useStyles()
    const history = useHistory()
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        if (state.Email.trim() && state.password.trim()) {
            dispatch({
                type: 'setIsButtonDisabled',
                payload: false,
            })
        } else {
            dispatch({
                type: 'setIsButtonDisabled',
                payload: true,
            })
        }
    }, [state.Email, state.password])

    const handleLogin = () => {
        let email = emailRef.current ? emailRef.current.value : ''
        let password = passwordRef.current ? passwordRef.current.value : ''

        const param = {
            email: email,
            password: password,
            auth_token: '',
        }

        const getUserAuth = async () => {
            await axios
                .post(API_GENERAL_USER_LOG_IN, param)
                .then((response) => {
                    if (response.status === 200) {
                        localStorage.clear()
                        const token = response.data.auth_token
                        localStorage.setItem('token', token)
                        history.push('/my_violations')
                    }
                })
                .catch((e) => {
                    if (e.response) {
                        console.log(e.response.data)
                    }
                    dispatch({
                        type: 'loginFailed',
                        payload: 'Incorrect email or password',
                    })
                })
        }
        getUserAuth()
    }

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.keyCode === 13 || event.which === 13) {
            state.isButtonDisabled || handleLogin()
        }
    }

    const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (
        event
    ) => {
        dispatch({
            type: 'setEmail',
            payload: event.target.value,
        })
    }

    const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (
        event
    ) => {
        dispatch({
            type: 'setPassword',
            payload: event.target.value,
        })
    }
    return (
        <div className={classes.root}>
            <form className={classes.container} noValidate autoComplete="off">
                <Card className={classes.card}>
                    <CardHeader className={classes.header} title="Login" />
                    <CardContent>
                        <div>
                            <TextField
                                required
                                error={state.isError}
                                fullWidth
                                id="Email"
                                type="Email"
                                label="Email"
                                placeholder="Email"
                                margin="normal"
                                inputRef={emailRef}
                                onChange={handleEmailChange}
                                onKeyPress={handleKeyPress}
                            />
                            <TextField
                                required
                                error={state.isError}
                                fullWidth
                                id="password"
                                type="password"
                                label="Password"
                                placeholder="Password"
                                margin="normal"
                                inputRef={passwordRef}
                                helperText={state.helperText}
                                onChange={handlePasswordChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                    </CardContent>
                    <CardActions>
                        <Button
                            variant="contained"
                            size="large"
                            color="secondary"
                            className={classes.loginBtn}
                            onClick={handleLogin}
                            disabled={state.isButtonDisabled}
                        >
                            Login
                        </Button>
                    </CardActions>
                </Card>
            </form>
        </div>
    )
}

export default Login