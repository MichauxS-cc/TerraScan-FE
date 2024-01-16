import { FC, ReactElement, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Confetti from "react-confetti"
// import SearchBar from "material-ui-search-bar"

// components
import PageTitle from '../components/PageTitle'
import Dashboard from '../components/Dashboard'

// constants
import {
    APP_TITLE,
    USER_VIEW_ALL_VIOS,
    API_ADMIN_VIO_QUERY_SEARCH,
    DASHBOARD_NO_VIOLATION,
} from '../utils/constants'

// REST API
import axios from 'axios'
import jwt_decode from 'jwt-decode'

// define css-in-js
const useStyles = makeStyles(() =>
    createStyles({
        root: {
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
    })
)

const MyViolation: FC<{}> = (): ReactElement => {
    const classes = useStyles()

    interface Row {
        [key: string]: string;
      }
    
    interface OneRow extends Row {
        id: string,
        pull_url: string,
        repo_name: string,
        file_path: string,
        line_number: string,
        resource_name: string,
        timestamp_found: string,
        timestamp_fixed: string,
        rule_id: string,
        github_username: string,
        severity: string,
      }

    const [violations, setViolations] = useState<OneRow[]>([])
    const token = localStorage.getItem('token')

    //need to set up a template for token
    interface MyToken {
        ghb: string,
    }
    
    const decoded = jwt_decode<MyToken>(token ? token : 'NO USER')
    const username = decoded.ghb

    useEffect(() => {
        const fetchVios = async () => {
            await axios
                .get(API_ADMIN_VIO_QUERY_SEARCH, {
                    headers: {
                        'content-type': 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                    params: { user: username },
                })
                .then((res: any) => {
                    setViolations(res.data)
                })
                .catch((e: any) => {
                    if (e.response) {
                        console.log(e.response.data)
                    }
                })
        }
        fetchVios()
    }, [username, token])

    const handleDisplayVioDashboard = (): any => {
        if (!violations) {
            setViolations([])
        }

        const viosArr = violations
        if (viosArr) {
            return <Dashboard violations={violations} boardType='MyViolation' />
        } else {
            return <h2> {DASHBOARD_NO_VIOLATION} </h2>
        }
    }

    return (
        <>
            <Helmet>
                <title>
                    {} | {APP_TITLE}
                </title>
            </Helmet>
            <div className={classes.root}>
                <PageTitle title={USER_VIEW_ALL_VIOS} />
            </div>
            
            {violations.length === 0 ? 
            <div style={{fontSize:'30px', textAlign:'center'}}>
                {DASHBOARD_NO_VIOLATION}
                <Confetti />
            </div> :
            handleDisplayVioDashboard()}
        </>
    )
}

export default MyViolation