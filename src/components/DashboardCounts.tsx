import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'

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
import GitHubIcon from '@mui/icons-material/GitHub'

import {
    PieChart,
    Pie,
    Tooltip,
    Cell,
    ResponsiveContainer,
} from "recharts"
// constants
import { COLORS } from '../utils/constants'
import RuleDetail from '../components/RuleDetail'

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    tableContainer: {
        borderRadius: 15,
        margin: '10px 10px',
        maxWidth: '80vw',
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
        color: 'textSecondary'
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
}))

function DashboardCounts(props: any) {
    const history = useHistory()
    const classes = useStyles()
    const dataList: any[] = [...props.countList]
    const data = dataList.map((n) => {
        n.count = Number(n.count)
        return n
    })
    console.log("data: ", data)
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(15)

    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const goToSearchPage = (repoName: string) => {
        localStorage.setItem('repoName', repoName)
        history.push({
            pathname: '/vq/search',
        })
    }

    return (
        <div>
            <ResponsiveContainer height={400} width="100%">
                <PieChart >
                    <Pie
                        dataKey="count"
                        nameKey={props.column}
                        isAnimationActive={true}
                        data={data}
                        cx={'50%'}
                        cy={'50%'}
                        outerRadius={80}
                        fill="#8884d8"
                        // label
                        label={({
                            cx,
                            cy,
                            midAngle,
                            innerRadius,
                            outerRadius,
                            value,
                            index
                        }) => {
                            const RADIAN = Math.PI / 180
                            const radius = 25 + innerRadius + (outerRadius - innerRadius)
                            const x = cx + radius * Math.cos(-midAngle * RADIAN)
                            const y = cy + radius * Math.sin(-midAngle * RADIAN)

                            return (
                                <text
                                    x={x}
                                    y={y}
                                    fill="#8884d8"
                                    textAnchor={x > cx ? "start" : "end"}
                                    dominantBaseline="central"
                                >
                                    {data[index][props.column]} ({value})
                                </text>
                            );
                        }}
                    >
                        {data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {props.headers.map((header: any) => (
                                <TableCell
                                    key={header}
                                    className={classes.tableHeaderCell}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.countList
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((row: any) => (
                                < TableRow key={row.violation_id} >
                                    <TableCell>
                                        {props.column == 'repo_name' ?
                                            <Typography className={classes.name}>
                                                <div>
                                                    <Button onClick={() => goToSearchPage(row[props.column])}>
                                                        {row[props.column]}
                                                    </Button>
                                                    <Button variant="contained">
                                                        <GitHubIcon />
                                                        <a href={`https://github.com/${row[props.column]}`} style={{ textDecoration: 'none' }}> Go to GitHub </a>
                                                    </Button>
                                                </div>
                                            </Typography>
                                            :
                                            <RuleDetail
                                                id={row.rule_id}
                                                description={row.description}
                                                page='Top10Rules'
                                            />
                                        }
                                    </TableCell>

                                    <TableCell>
                                        <Typography
                                            // color="textSecondary"
                                            className={classes.name}
                                            variant="body2"
                                        >
                                            {row.count}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TableFooter>
                    <TablePagination
                        rowsPerPageOptions={[15, 25, 50]}
                        component="div"
                        count={props.countList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        labelDisplayedRows={() => {
                            return `${page}-${Math.floor(props.countList.length / rowsPerPage)}`
                        }}
                    />
                </TableFooter>
            </TableContainer>
        </div >
    )
}

export default DashboardCounts