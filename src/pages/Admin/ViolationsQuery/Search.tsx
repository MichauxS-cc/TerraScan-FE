import {
    MouseEvent,
    useState,
    useEffect,
} from 'react'
import { Helmet } from 'react-helmet'
import Dashboard from '../../../components/Dashboard'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import SearchBar from "material-ui-search-bar"
import axios from 'axios'

// components
import PageTitle from '../../../components/PageTitle'

// constants
import {
    APP_TITLE,
    ADMIN_VIO_QUERY_SEARCH,
    API_ADMIN_VIO_QUERY_SEARCH,
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
        search_btn: {
            paddingTop: 20,
        },
        dashboard: {
            marginTop: 30,
        },
        searchFeild: {
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
        },
        grids: {
            width: '20%',
            minWidth: '10%',
            margin: 'auto',
        }
    })
)

const TSearch = () => {
    const classes = useStyles()
    const token = localStorage.getItem('token')

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

    const [violations, setViolations] = useState<Array<OneRow>>([])
    const rNameFromCaller = localStorage.getItem('repoName')
    console.log('repoName: ', rNameFromCaller)

    const [userNameInput, setUserName] = useState<string>('')
    const [repoNameInput, setRepoName] = useState<string>('')
    const [prlinkInput, setPrlink] = useState<string>('')

    useEffect(() => {
        const getTotalVioPerRepo = async () => {
            await axios
                .get(API_ADMIN_VIO_QUERY_SEARCH, {
                    headers: {
                        'content-type': 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                })
                .then((response) => {
                    setViolations(response.data)
                })
                .catch((e) => {
                    if (e.response) {
                        console.log(e.response.data)
                    }
                })
        }
        getTotalVioPerRepo()
        
        if (rNameFromCaller) setRepoName(rNameFromCaller)
    }, [])

    


    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        event?.preventDefault()

        const getViolationBasedOnUserinput = async () => {
            await axios
                .get(API_ADMIN_VIO_QUERY_SEARCH, {
                    headers: {
                        'content-type': 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                    params: {
                        user: userNameInput,
                        repo: repoNameInput,
                        pull_request: prlinkInput,
                    },
                })
                .then((response) => {
                    setViolations(response.data)
                    localStorage.removeItem('repoName')
                    cancelSearch()
                })
                .catch((e) => {
                    if (e.response) {
                        console.log(e.response.data)
                    }
                })
        }
        getViolationBasedOnUserinput() 
    }

    const cancelSearch = () => {
        setUserName('')
        setRepoName('')
        setPrlink('')
    }

    return (
        <>
            <Helmet>
                <title>
                    {ADMIN_VIO_QUERY_SEARCH} | {APP_TITLE}
                </title>
            </Helmet>
            <div className={classes.root}>
                <PageTitle title={ADMIN_VIO_QUERY_SEARCH} />
            </div>
            
            <div className={classes.searchFeild}>
                <SearchBar
                    className={classes.grids}
                    value={userNameInput}
                    onChange={(searchVal) => setUserName(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    style={{width: '33%'}}
                    placeholder='Search by GitHub Username'
                    />
                <SearchBar
                    className={classes.grids}
                    value={rNameFromCaller ? rNameFromCaller : repoNameInput}
                    onChange={(searchVal) => setRepoName(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    style={{width: '33%'}}
                    placeholder='Search by Repo Name'
                    />
                <SearchBar
                    className={classes.grids}
                    value={prlinkInput}
                    onChange={(searchVal) => setPrlink(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    style={{width: '33%'}}
                    placeholder='Search by GitHub Pull Request Link'
                    />
                <div className={classes.grids}>
                    <Button
                        className="search_btn"
                        onClick={handleClick}
                        color="primary"
                        variant="contained"
                        fullWidth
                        type="submit"
                        style={{
                            maxWidth: '100px',
                            maxHeight: '30px',
                            minWidth: '30px',
                            minHeight: '30px',
                        }}
                    >
                        SUBMIT
                    </Button>
                </div>
            </div>
            <div className={classes.dashboard}><Dashboard violations={violations} boardType='Search'/></div>
        </>
    )
}

export default TSearch