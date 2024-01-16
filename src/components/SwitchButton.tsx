import React, { useState } from 'react'
import {
    TableCell,
    Typography,
    Switch,
} from '@material-ui/core'
// constants
import { API_ADMIN_MANAGE_RULES_DISABLE, API_ADMIN_MANAGE_RULES_ENABLE } from '../utils/constants'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface RuleInfo {
    rule: any
}

const SwitchButton = (props: RuleInfo) => {
    const initialState = props.rule.enabled
    const [checked, setChecked] = useState(initialState)
    const token = localStorage.getItem('token')
    const notify = () => {
        if (checked) {
            toast(`Disabling Rule ${props.rule.id}`)
        } else {
            toast(`Enabling Rule ${props.rule.id}`)
        }
    }

    const handleClickModify = (rule: any): any => {
        let ruleStatus = API_ADMIN_MANAGE_RULES_DISABLE
        if (!rule.enabled) {
            ruleStatus = API_ADMIN_MANAGE_RULES_ENABLE
        }
        const modifyRules = async () => {
            console.log(rule.id)
            await axios
                .put(ruleStatus + rule.id, {
                    params: {
                        id: rule.id,
                    },
                }, {
                    headers: {
                        'content-type': 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                })
                .then((res: any) => {
                    console.log("status: ", res.data)
                    setChecked(!checked)
                })
                .catch((e: any) => {
                    if (e.response) {
                        console.log(e.response.data)
                        alert('invalid action')
                    }
                })
        }
        modifyRules()
    }


    return (
        <TableCell>
            <Typography
                color="primary"
                variant="body2"
            >
                {checked ? `Enabled` : `Disabled`}
                <Switch checked={checked} onClick={notify} onChange={() => handleClickModify(props.rule)} />
                <ToastContainer limit={3} />
            </Typography>
        </TableCell>
    )
}

export default SwitchButton
