import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TablePagination,
    TableFooter,
    Button,
} from '@material-ui/core'
// constants
import { RULES_DASHBOARD_HEADERS, SEVERITY, SEVERITY_COLOR } from '../utils/constants'
import SwitchButton from './SwitchButton'
// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import RuleDetail from '../components/RuleDetail'
import axios from 'axios'
import { API_ADMIN_MANAGE_A_RULE } from '../utils/constants'
import SearchBar from "material-ui-search-bar"
// import CircularProgress from '@mui/material/CircularProgress'
// import DeleteRuleButton from '../components/DeleteRuleButton'
import CircularProgress from '@mui/material/CircularProgress'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'

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
        fontWeight: 'bold',
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.getContrastText(theme.palette.primary.dark),
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
    icon: {
        display: 'inline-block',
        color: theme.palette.primary.main,
    },

}))

interface Row {
    [key: string]: string;
}

interface OneRow extends Row {
    id: string,
    description: string,
    yaml_file: string,
    created: string,
    last_modified: string,
    severity: string,
    category: string,
    enabled: string,
}

interface DashboardInfo {
    rules: OneRow[]
}

const RulesDashboard = (props: DashboardInfo) => {
    const classes = useStyles()
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(15)
    const [sortUp, setSortState] = React.useState(true)
    const [sortCriteria, setSortCriteria] = React.useState('id')
    const token = localStorage.getItem('token')
    const [loadingRowId, setLoadingRowId] = React.useState("")


    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const sortRules = (a: any, b: any) => {
        if (sortUp) {
            return (a[sortCriteria] > b[sortCriteria]) ? 1 : -1
        } else {
            return (a[sortCriteria] > b[sortCriteria]) ? -1 : 1
        }
    };

    const handleSort = (header: string) => {
        setSortState(!sortUp)
        if (header == 'Rule ID') {
            setSortCriteria('id')
        } else if (header == 'Rule Description') {
            setSortCriteria('description')
        } else if (header == 'Creation Date') {
            setSortCriteria('created')
        } else if (header == 'Severity') {
            setSortCriteria('severity')
        } else if (header == 'Category') {
            setSortCriteria('category')
        } else {
            setSortCriteria('enabled')
        }
    };

    const originalRows = props.rules
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

    const handleDeleteRule = async (id: string) => {
        setLoadingRowId(id)
        console.log("delete id: " + id)
        const url = API_ADMIN_MANAGE_A_RULE + id
        const config = {
            headers: {
                'content-type': 'application/json',
                Authorization: 'Bearer ' + token,
            }
        }

        const deleteARule = async () => {
            await axios
                .delete(
                    url,
                    config
                )
                .then((res: any) => {
                    console.log(res)
                    setRows(
                        rows.filter((ele) => ele.id !== id)
                    )
                    setLoadingRowId("");
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }
        await deleteARule()
    }

    const showDeleteCellStatus = (id: string) => {
        if (id === loadingRowId) {
            const spinningStyle = {
                color: "#d80404",
                display: "inline-block",
                width: '50%',
                height: '50%',
            }
            return (
                <CircularProgress style={spinningStyle} />)
        }

        return (<DeleteOutlineOutlinedIcon
            className={classes.icon}
            onClick={() => { handleDeleteRule(id) }} />)
    }

    return (
        <>
            <div>
                <SearchBar
                    value={searched}
                    onChange={(searchVal) => requestSearch(searchVal, 'description')}
                    onCancelSearch={() => cancelSearch()}
                    style={{ width: '50%' }}
                    placeholder='Search by Rule Description'
                />
            </div>
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {RULES_DASHBOARD_HEADERS.map((header) => (
                                <TableCell
                                    key={header}
                                    className={classes.tableHeaderCell}
                                >
                                    {header}
                                    {
                                        (header == 'Delete' || header == 'Status') ?
                                            null :
                                            <Button
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
                                            </Button>
                                    }

                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .sort((a: any, b: any) => sortRules(a, b))
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((row: any) => (
                                <TableRow key={row.id} style={row.enabled ? { background: "white" } : { background: "#E0E0E0" }}>
                                    <TableCell>
                                        <Typography
                                            color="primary"
                                            variant="subtitle2"
                                        >
                                            {row.id}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <RuleDetail
                                            id={row.id}
                                            description={row.description}
                                            page='manageAllRules'
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Typography
                                            color="primary"
                                            variant="body2"
                                        >
                                            {row.created}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
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

                                    <TableCell>
                                        <Typography
                                            color="primary"
                                            variant="body2"
                                        >
                                            {row.category}
                                        </Typography>
                                    </TableCell>

                                    <SwitchButton rule={row} />

                                    <TableCell
                                    >
                                        {showDeleteCellStatus(row.id)}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TableFooter>
                    <TablePagination
                        rowsPerPageOptions={[15, 25, 50]}
                        component="div"
                        count={props.rules.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        labelDisplayedRows={() => {
                            return `${page}-${Math.floor(props.rules.length / rowsPerPage)}`
                        }}
                    />
                </TableFooter>
            </TableContainer>
        </>
    )
}

export default RulesDashboard
