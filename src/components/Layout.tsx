import { FC, ReactNode, useReducer } from "react";
import clsx from "clsx";
import {
  makeStyles,
  createStyles,
  Theme,
  CssBaseline,
} from "@material-ui/core";
import jwt_decode from 'jwt-decode'

// components
import Header from "./Header";
import Navigation from "./Navigation";
import Footer from "./Footer";

// constants
import { DRAWER_WIDTH, FOOTER_HEIGHT } from "../utils/constants";

// define css-in-js
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      minHeight: `calc(100vh - ${FOOTER_HEIGHT}px)`,
      background: theme.palette.background.paper,
      marginLeft: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      ...theme.mixins.toolbar,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: DRAWER_WIDTH,
    },
  })
);

// define interface to represent component props
interface LayoutProps {
  toggleTheme: () => void;
  useDefaultTheme: boolean;
  children: ReactNode;
}

// functional component
const Layout: FC<LayoutProps> = ({
  toggleTheme,
  useDefaultTheme,
  children,
}: LayoutProps) => {
  const classes = useStyles()
  const handleDispatch = (open: any) => {
    localStorage.setItem('header_state', `${!open}`)
    return !open
  }

  const initialHeaderState: boolean = localStorage.getItem('header_state') === 'true'
  const [open, toggle] = useReducer(handleDispatch, initialHeaderState)
  const token = localStorage.getItem('token')

  
  //need to set up a template for token
  interface MyToken {
    adm: boolean
  }
  const decoded = jwt_decode<MyToken>(token ? token : 'NO USER')
  const isAdmin = decoded.adm

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header
        isAdmin={isAdmin}
        open={open}
        handleMenuOpen={toggle}
        toggleTheme={toggleTheme}
        useDefaultTheme={useDefaultTheme}
      />
      {isAdmin ? <Navigation open={open} handleMenuClose={toggle} /> : null}
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: isAdmin ? open: null,
        })}
      >
        <div className={classes.toolbar} />
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;