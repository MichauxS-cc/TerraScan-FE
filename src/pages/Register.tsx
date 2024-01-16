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

// constants
import { API_GENERAL_USER_REGISTER } from '../utils/constants'

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
            margin: `${theme.spacing(0)} auto`,
        },
        signupBtn: {
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
    github: string,
    email: string,
    password: string,
    isButtonDisabled: boolean,
    helperText: string,
    isError: boolean,
}

const initialState: State = {
    github: '',
    email: '',
    password: '',
    isButtonDisabled: true,
    helperText: '',
    isError: false,
}

type Action =
    | { type: 'setGitHub'; payload: string }
    | { type: 'setemail'; payload: string }
    | { type: 'setPassword'; payload: string }
    | { type: 'setIsButtonDisabled'; payload: boolean }
    | { type: 'loginSuccess'; payload: string }
    | { type: 'signupFailed'; payload: string }
    | { type: 'setIsError'; payload: boolean }

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'setGitHub':
            return {
                ...state,
                github: action.payload,
            }
        case 'setemail':
            return {
                ...state,
                email: action.payload,
            }
        case 'setPassword':
            return {
                ...state,
                password: action.payload,
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
        case 'signupFailed':
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

const Register = () => {
    const classes = useStyles()
    const history = useHistory()
    const githubRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        if (
            state.github.trim() &&
            state.email.trim() &&
            state.password.trim()
        ) {
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
    }, [state.github, state.email, state.password])

    const handleRegister = () => {
        let github = githubRef.current ? githubRef.current.value : ''
        let email = emailRef.current ? emailRef.current.value : ''
        let password = passwordRef.current ? passwordRef.current.value : ''

        const param = {
            github: github,
            email: email,
            password: password,
        }

        console.log(param)

        const getUserAuth = async () => {
            await axios
                .post(API_GENERAL_USER_REGISTER, param)
                .then((response) => {
                    if (response.status === 201) {
                        history.push('/login')
                    }
                })
                .catch((e) => {
                    if (e.response) {
                        console.log(e.response.data)
                    }
                    dispatch({
                        type: 'signupFailed',
                        payload: 'User already exist',
                    })
                })
        }
        getUserAuth()
    }

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.keyCode === 13 || event.which === 13) {
            state.isButtonDisabled || handleRegister()
        }
    }

    const handleGitHubChange: React.ChangeEventHandler<HTMLInputElement> = (
        event
    ) => {
        dispatch({
            type: 'setGitHub',
            payload: event.target.value,
        })
    }

    const handleemailChange: React.ChangeEventHandler<HTMLInputElement> = (
        event
    ) => {
        dispatch({
            type: 'setemail',
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
                    <CardHeader className={classes.header} title="Sign Up" />
                    <CardContent>
                        <div>
                            <TextField
                                required
                                error={state.isError}
                                fullWidth
                                id="email"
                                type="email"
                                label="Email"
                                placeholder="Email"
                                margin="normal"
                                inputRef={emailRef}
                                onChange={handleemailChange}
                                onKeyPress={handleKeyPress}
                            />
                            <TextField
                                required
                                error={state.isError}
                                fullWidth
                                id="github"
                                type="github"
                                label="GitHub User ID"
                                placeholder="GitHub User ID"
                                margin="normal"
                                inputRef={githubRef}
                                onChange={handleGitHubChange}
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
                            className={classes.signupBtn}
                            onClick={handleRegister}
                            disabled={state.isButtonDisabled}
                        >
                            Sign Up
                        </Button>
                    </CardActions>
                </Card>
            </form>
        </div>
    )
}

export default Register