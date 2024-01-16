import * as React from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { API_ADMIN_MANAGE_A_RULE } from '../utils/constants'

const useStyles = makeStyles((theme) => ({
    description: {
        '&:hover': {
            textDecoration: 'underline',
            cursor: 'zoom-in'
        },
        color: theme.palette.primary.main
    }
}))

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}))

interface DialogTitleProps {
    id: string,
    children?: React.ReactNode,
    onClose: () => void,
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                ></IconButton>
            ) : null}
        </DialogTitle>
    )
}

interface RuleInfo {
    id: any,
    description: string,
    page: string,
}

const RuleDetail = (props: RuleInfo) => {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)
    const token = localStorage.getItem('token')
    const [response, setResponse] = React.useState({
        description: "",
        mDate: "",
        content: ""
    })

    const handleClickOpen = async () => {
        console.log("open: ", props.id);
        const url = API_ADMIN_MANAGE_A_RULE + props.id
        const config = {
            headers: {
                'content-type': 'application/json',
                Authorization: 'Bearer ' + token,
            }
        }

        const getDetail = async () => {
            await axios
                .get(
                    url,
                    config
                )
                .then((res: any) => {
                    const response = res.data[0]
                    console.log(response)
                    setResponse({
                        description: response.description,
                        mDate: response.last_modified,
                        content: response.yaml_file
                    })
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }
        await getDetail()

        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const handleDisplayTypography = () => {
        if (props.page == "manageAllRules" || props.page == 'Top10Rules') {
            return (<Typography
                variant="subtitle2"
                className={classes.description}
                onClick={handleClickOpen}
            >
                {props.description}
            </Typography>)
        }
        if (props.page == "search") {
            return (<Typography
                className={classes.description}
                variant="body2"
                onClick={handleClickOpen}
            >
                <strong>Rule ID:</strong>{' '}
                {props.id}
            </Typography>)
        }
        return null
    }

    return (
        <div>
            {handleDisplayTypography()}
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                >
                    {response.description}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        <strong>last modified date:</strong> <pre>{response.mDate}</pre>
                        <br />
                        <strong>content:</strong> <pre>{response.content}</pre>
                    </Typography>
                    <Typography gutterBottom></Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    )
}

export default RuleDetail