import { FC, ReactElement, useState, useEffect } from "react"

import { Helmet } from 'react-helmet'
import { makeStyles, createStyles } from '@material-ui/core/styles'
// import axios from 'axios'

// components
import PageTitle from '../../../components/PageTitle'
import DashboardCounts from '../../../components/DashboardCounts'
import axios from 'axios'

// constants
import {
    APP_TITLE,
    ADMIN_VIO_QUERY_TOP_10_RULES,
    API_ADMIN_VIO_QUERY_AGGREGATED,
    HEADER_HEIGHT,
    TOP10_RULES_DASHBOARD_HEADERS,
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
        rulesPane: {
            padding: HEADER_HEIGHT + 20,
            overflow: 'hidden',
        },
        dropZone: {
            width: '50%',
        },
        dashboard: {
			marginTop: 80,
		},
    })
)

const TTop10Rules: FC<{}> = (): ReactElement => {
    const classes = useStyles()
    const token = localStorage.getItem('token')

	const [rules, setRules] = useState<Array<string>>([])

	useEffect(() => {
		const fetchRules = async () => {
            await axios
                .get(API_ADMIN_VIO_QUERY_AGGREGATED, {
                        headers: {
                                'content-type': 'application/json',
                                Authorization: 'Bearer ' + token,
                        },
                        params: { type: 'top10' },
                })
                .then((res: any) => {
                    setRules(res.data)
                })
                .catch((err: any) => {
                        console.log(err)
                })
		}
		fetchRules()
	}, [])

    return (
        <>
            <Helmet>
                <title>
                    {ADMIN_VIO_QUERY_TOP_10_RULES} | {APP_TITLE}
                </title>
            </Helmet>
            <div className={classes.root}>
                <PageTitle title={ADMIN_VIO_QUERY_TOP_10_RULES} />
            </div>
            <div>
                <DashboardCounts countList={rules} headers={TOP10_RULES_DASHBOARD_HEADERS} column='description'/>

            </div>
        </>
    )
}

export default TTop10Rules