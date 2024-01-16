import clsx from "clsx";
import { useHistory } from 'react-router-dom'
import {
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Tooltip,
	createStyles,
	makeStyles,
	Theme,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness3Icon from "@material-ui/icons/Brightness3";

// constants
import { APP_TITLE, DRAWER_WIDTH } from "../utils/constants";

// define css-in-js
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		appBar: {
			zIndex: theme.zIndex.drawer + 1,
			transition: theme.transitions.create(["width", "margin"], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			backgroundColor: theme.palette.background.default,
			borderBottom: "3px solid " + theme.palette.primary.main,
		},
		appBarShift: {
			marginLeft: DRAWER_WIDTH,
			width: `calc(100% - ${DRAWER_WIDTH}px)`,
			transition: theme.transitions.create(["width", "margin"], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
		},
		toolbar: {
			flex: 1,
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
		},
		title: {
			flex: 1,
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
		},
		menuButton: {
			marginRight: 36,
		},
		hide: {
			display: "none",
			borderRight: "3px solid " + theme.palette.primary.main,
		},
		textColor: {
			color: theme.palette.text.primary,
		}
	})
);

// define interface to represent component props
interface HeaderProps {
	isAdmin: boolean;
	open: boolean;
	handleMenuOpen: () => void;
	toggleTheme: () => void;
	useDefaultTheme: boolean;
}

const Header = ({
	isAdmin,
	open,
	handleMenuOpen,
	toggleTheme,
	useDefaultTheme,
}: HeaderProps) => {
	const classes = useStyles();
	const history = useHistory()

	const handleLogout = () => {
		localStorage.clear()
		history.push('/')
	}
	return (
		<AppBar
			position="fixed"
			elevation={0}
			className={clsx(classes.appBar, {
				[classes.appBarShift]: isAdmin ? open : null,
			})}
		>
			<Toolbar className={classes.toolbar}>
				<div className={classes.title}>
					{isAdmin ? <IconButton
						// color="inherit"
						aria-label="open menu"
						onClick={handleMenuOpen}
						edge="start"
						className={clsx(classes.menuButton, {
							[classes.hide]: isAdmin ? open : null,
						})}
						size="small"
					>
						<MenuIcon />
					</IconButton> : null}

					<img src='../../hsbc.ico' alt='../../logo192.png' style={{ padding: 5 }} />

					<Typography variant="h6" className={classes.textColor} noWrap>
						{APP_TITLE}
					</Typography>
				</div>
				<IconButton size="small" onClick={handleLogout} color="inherit" className={classes.textColor}>
					{' '}
					Log Out
				</IconButton>
				<IconButton onClick={toggleTheme}>
					{useDefaultTheme ? (
						<Tooltip title="Switch to dark mode" placement="bottom">
							<Brightness3Icon />
						</Tooltip>
					) : (
						<Tooltip title="Switch to light mode" placement="bottom">
							<Brightness7Icon />
						</Tooltip>
					)}
				</IconButton>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
