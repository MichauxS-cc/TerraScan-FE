import { makeStyles, createStyles, Theme } from "@material-ui/core"
import { Typography } from '@material-ui/core'

// constants
import { FOOTER_TEXT, FOOTER_HEIGHT } from "../utils/constants";

// define css-in-js
const useStyles = makeStyles((theme: Theme) =>

	createStyles({
		root: {
			flex: 1,
			display: "flex",
			justifyContent: "center",
			background: theme.palette.background.paper,
			minHeight: FOOTER_HEIGHT,
		},
		footer: {
			textTransform: "uppercase",
			zIndex: 1,
			display: 'center',
		},
	})
);

// functional component
const Footer = () => {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<Typography
				className={classes.footer}
			>
				{FOOTER_TEXT}
			</Typography>
		</div>
	);
};

export default Footer;
