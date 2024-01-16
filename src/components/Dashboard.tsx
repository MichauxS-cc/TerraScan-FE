import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import SearchBar from "material-ui-search-bar"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Typography,
    TablePagination,
    TableFooter,
    Button,
} from '@material-ui/core'
// constants
import RuleDetail from '../components/RuleDetail'
import { VIOLATION_DASHBOARD_HEADERS, SEVERITY, SEVERITY_COLOR } from '../utils/constants'

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    tableContainer: {
        borderRadius: 15,
        margin: '10px 10px',
        maxWidth: '100%',
    },
    tableHeaderCell: {
        whiteSpace: "normal",
        fontWeight: 'bold',
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.getContrastText(theme.palette.primary.dark),
    },
    tableCell: {
        fontSize: "10px",
        whiteSpace: "normal",
        wordWrap: "break-word",
        wordBreak: "break-all",
    },
    avatar: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.getContrastText(theme.palette.primary.light),
    },
    name: {
        fontWeight: 'bold',
        color: theme.palette.secondary.dark,
    },
    status: {
        fontWeight: 'bold',
        fontSize: '0.75rem',
        color: 'white',
        backgroundColor: 'grey',
        borderRadius: 8,
        padding: '3px 10px',
        display: 'inline-block',
    },
    searchFeild: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
    },
    grids: {
        width: '20%',
        minWidth: '10%',
    },
    githublink: {
        '&:hover': {
            textDecoration: 'underline',
            cursor: 'pointer'
        },
        color: theme.palette.primary.main
    }
}))

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

interface DashboardInfo {
    boardType: string,
    violations: OneRow[]
}

const Dashboard = (props: DashboardInfo) => {
    const classes = useStyles()
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(15)
    const [sortUp, setSortState] = useState(true)
    const [sortCriteria, setSortCriteria] = useState('timestamp_found')

    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const getStatus = (fix_date: string) => {
        return fix_date === null ? 'Pending' : 'Resolved'
    }

    const sortViolations = (a: any, b: any) => {
        // console.log("sortCriteria: ", sortCriteria)
        if (sortUp) {
            return (a[sortCriteria] > b[sortCriteria]) ? 1 : -1
        } else {
            return (a[sortCriteria] > b[sortCriteria]) ? -1 : 1
        }
    };

    const handleSort = (header: string) => {
        setSortState(!sortUp)
        // console.log("sortUp: ", sortUp)
        if (header == 'Violation Info') {
            setSortCriteria('id')
        } else if (header == 'PR Info') {
            setSortCriteria('repo_name')
        } else if (header == 'GitHub Username') {
            setSortCriteria('github_username')
        } else if (header == 'Severity') {
            setSortCriteria('severity')
        } else if (header == 'Status') {
            setSortCriteria('timestamp_fixed')
        } else {
            setSortCriteria('timestamp_found')
        }
    };

    const originalRows = props.violations
    const [rows, setRows] = useState<OneRow[]>([...originalRows])
    const [searched, setSearched] = useState<string>("")

    useEffect(() => {
        setRows(originalRows)
    }, [originalRows])

    const requestSearch = (searchedVal: any, searchCriteria: string) => {
        console.log("searchedVal: ", searchedVal)
        console.log("searchCriteria: ", searchCriteria)
        const filteredRows = originalRows.filter((row: OneRow) => {
            return row[searchCriteria].toLowerCase().includes(searchedVal.toLowerCase())
        })
        setRows(filteredRows)
    }

    const cancelSearch = () => {
        setSearched("")
        setRows(originalRows)
    }

    return (
        <>
            {props.boardType === 'MyViolation' ? <div className={classes.searchFeild}>
                <SearchBar
                    className={classes.grids}
                    value={searched}
                    onChange={(searchVal) => requestSearch(searchVal, 'repo_name')}
                    onCancelSearch={() => cancelSearch()}
                    style={{ width: '33%' }}
                    placeholder='Search by Repo Name'
                />
                <SearchBar
                    className={classes.grids}
                    value={searched}
                    onChange={(searchVal) => requestSearch(searchVal, 'github_username')}
                    onCancelSearch={() => cancelSearch()}
                    style={{ width: '33%' }}
                    placeholder='Search by GitHub Username'
                />
                <SearchBar
                    className={classes.grids}
                    value={searched}
                    onChange={(searchVal) => requestSearch(searchVal, 'timestamp_found')}
                    onCancelSearch={() => cancelSearch()}
                    style={{ width: '33%' }}
                    placeholder='Search by Created Date (yyyy-mm-dd)'
                />
            </div> : null}
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {VIOLATION_DASHBOARD_HEADERS.map((header) => (
                                <TableCell
                                    key={header}
                                    className={classes.tableHeaderCell}
                                >
                                    {header}
                                    {header == 'Status' ? null : <Button
                                        className="search_btn"
                                        onClick={() => handleSort(header)}
                                        variant="contained"
                                        fullWidth
                                        type="submit"
                                        style={{
                                            maxWidth: '10px',
                                            maxHeight: '10px',
                                            minWidth: '10px',
                                            minHeight: '10px',
                                            backgroundColor: "blue",
                                            fontSize: '9px',
                                            color: 'white',
                                        }}
                                    >
                                        sort
                                    </Button>}
                                    
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .sort((a: any, b: any) => sortViolations(a, b))
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((row: any) => (
                                <TableRow key={row.id}>
                                    <TableCell className={classes.tableCell} style={{ width: "20%" }}
                                    >
                                        <Grid container>
                                            <Grid item lg={12}>
                                                <Typography
                                                    color="textSecondary"
                                                    variant="body2"
                                                >
                                                    <strong>Violation ID:</strong>{' '}
                                                    {row.id}
                                                </Typography>
                                                <Typography
                                                    color="textSecondary"
                                                    variant="body2"
                                                >
                                                    <strong>Resource Name:</strong>{' '}
                                                    {row.resource_name}
                                                </Typography>
                                                <Typography
                                                    color="textSecondary"
                                                    variant="body2"
                                                >
                                                    <strong>File Path:</strong>{' '}
                                                    {row.file_path}
                                                </Typography>
                                                <Typography
                                                    color="textSecondary"
                                                    variant="body2"
                                                >
                                                    <strong>Line Number:</strong>{' '}
                                                    {row.line_number}
                                                </Typography>
                                                <RuleDetail
                                                    id={row.rule_id}
                                                    description={row.description}
                                                    page='search'
                                                />
                                            </Grid>
                                        </Grid>
                                    </TableCell>

                                    <TableCell className={classes.tableCell} style={{ width: "20%" }}>
                                        <Grid container>
                                            <Grid item lg={12}>
                                                <Typography
                                                    color="textSecondary"
                                                    variant="body2"
                                                >
                                                    <strong>
                                                        Pull Request Link:
                                                    </strong>{' '}
                                                    <a href={row.pull_url} className={classes.githublink}>{row.pull_url}</a>
                                                    {/* {row.pull_url} */}
                                                </Typography>
                                                <Typography
                                                    color="textSecondary"
                                                    variant="body2"
                                                >
                                                    <strong>Repo Name:</strong>{' '}
                                                    {row.repo_name}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </TableCell>

                                    <TableCell className={classes.tableCell}>
                                        <Typography
                                            color="primary"
                                            variant="subtitle2"
                                        >
                                            {row.github_username}
                                        </Typography>
                                    </TableCell>

                                    <TableCell className={classes.tableCell}>
                                        <Typography
                                            color="textSecondary"
                                            variant="body2"
                                        >
                                            {row.timestamp_found}
                                        </Typography>
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>
                                        <Typography
                                            className={classes.status}
                                            style={{
                                                backgroundColor:
                                                    SEVERITY_COLOR[row.severity],
                                            }}
                                        >
                                            {SEVERITY[row.severity]}
                                        </Typography>
                                    </TableCell>

                                    <TableCell className={classes.tableCell}>
                                        <Typography
                                            className={classes.status}
                                            style={{
                                                backgroundColor:
                                                    getStatus(
                                                        row.timestamp_fixed
                                                    ) === 'Resolved'
                                                        ? 'green'
                                                        : 'blue',
                                            }}
                                        >
                                            {getStatus(row.timestamp_fixed)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TableFooter>
                    <TablePagination
                        style={{ width: 400 }}
                        rowsPerPageOptions={[15, 25, 50]}
                        component="div"
                        count={props.violations.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        labelDisplayedRows={() => {
                            return `${page}-${Math.floor(rows.length / rowsPerPage)}`
                        }}
                    />
                </TableFooter>
            </TableContainer>
        </>
    )
}

export default Dashboard
