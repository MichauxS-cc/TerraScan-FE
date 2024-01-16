import { FC, ReactElement, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import DashboardCounts from '../../../components/DashboardCounts'
import axios from 'axios'

// components
import PageTitle from '../../../components/PageTitle'

// constants
import {
    APP_TITLE,
    ADMIN_VIO_QUERY_TOTAL_VIO_PER_REPO,
    API_ADMIN_VIO_QUERY_AGGREGATED,
    VIOLATION_PER_REPO_DASHBOARD_HEADERS,
} from '../../../utils/constants'

// define css-in-js
const useStyles = makeStyles(() =>
    createStyles({
        root: {
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        uni_title: {
            fontSize: 24,
            display: 'flex',
            justifyContent: 'center',
        },
    })
)

const TTotalVioPerRepo: FC<{}> = (): ReactElement => {
    const classes = useStyles()
    const [counts, setCounts] = useState([])
    const token = localStorage.getItem('token')
    console.log('token from TotalVioPerRepo: ', token)

    useEffect(() => {
        const getTotalVioPerRepo = async () => {
            await axios
                .get(API_ADMIN_VIO_QUERY_AGGREGATED, {
                    headers: {
                        'content-type': 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                    params: { type: 'count-per-repo' },
                })
                .then((res: any) => {
                    setCounts(res.data)
                })
                .catch((e: any) => {
                    if (e.response) {
                        console.log(e.response.data)
                    }
                })
        }
        getTotalVioPerRepo()
    }, [])

    return (
        <>
            <Helmet>
                <title>
                    {ADMIN_VIO_QUERY_TOTAL_VIO_PER_REPO} | {APP_TITLE}
                </title>
            </Helmet>
            <div className={classes.root}>
                <PageTitle title={ADMIN_VIO_QUERY_TOTAL_VIO_PER_REPO} />
            </div>
            <div>
                <DashboardCounts countList={counts} headers={VIOLATION_PER_REPO_DASHBOARD_HEADERS} column='repo_name' />
            </div>
        </>
    )
}

export default TTotalVioPerRepo