import { createMuiTheme, Theme } from "@material-ui/core";
import { blue, pink } from "@material-ui/core/colors";

// define light theme colors
export const lightTheme: Theme = createMuiTheme({
  palette: {
    text:{
      primary:'#d80404'
    },
    background:{
      default: '#ffffff'
    },
    type: "light",
    primary: {
      main: '#d80404'
    },
    secondary: {
      main: '#e5e5e5'
    },
  },
});

// define dark theme colors
export const darkTheme: Theme = createMuiTheme({
  palette: {
    text:{
      primary:'#ffffff'
    },
    background:{
      default: '#424242'
    },
    type: "dark",
    primary: {
      main: pink[300],
    },
    secondary: {
      main: blue[800],
    },
  },
});
