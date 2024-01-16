import React, { useReducer } from "react";
import {
  createMuiTheme,
  Theme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Helmet } from "react-helmet";

//general pages
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Register from './pages/Register'
// import User from './pages/User'


// components
import Layout from "./components/Layout";

// theme
import { lightTheme, darkTheme } from "./theme/appTheme";

// app routes
import { routes } from "./config";

// constants
import { APP_TITLE } from "./utils/constants";

// interfaces
import RouteItem from "./model/RouteItem.model";

// define app context
const AppContext = React.createContext(null);

// default component
const DefaultComponent = () => <div>No Component Defined.</div>;

function App() {
  const handleDispatch = (useDefaultTheme: any) => {
    localStorage.setItem('theme_state', `${!useDefaultTheme}`)
    return !useDefaultTheme
  }

  const initialThemeState: boolean = localStorage.getItem('theme_state') ? localStorage.getItem('theme_state') === 'true' : true
  const [useDefaultTheme, toggle] = useReducer(handleDispatch, initialThemeState);

  // define custom theme
  let theme: Theme = createMuiTheme(useDefaultTheme ? lightTheme : darkTheme);
  theme = responsiveFontSizes(theme);

  return (
    <>
      <Helmet>
        <title>{APP_TITLE}</title>
      </Helmet>
      <AppContext.Provider value={null}>
        <ThemeProvider theme={theme}>
          <Router>
            <Switch>
              <Route
                path="/"
                component={HomePage || DefaultComponent}
                exact
              />
              <Route
                path="/register"
                component={Register || DefaultComponent}
                exact
              />
              <Route
                path="/login"
                component={Login || DefaultComponent}
                exact
              />
              <Layout toggleTheme={toggle} useDefaultTheme={useDefaultTheme}>
                {/* for each route config, a react route is created */}
                {routes.map((route: RouteItem) =>
                  route.subRoutes ? (
                    route.subRoutes.map((item: RouteItem) => (
                      <Route
                        key={`${item.key}`}
                        path={`${item.path}`}
                        component={item.component || DefaultComponent}
                        exact
                      />
                    ))
                  ) : (
                    <Route
                      key={`${route.key}`}
                      path={`${route.path}`}
                      component={route.component || DefaultComponent}
                      exact
                    />
                  )
                )}
              </Layout>
            </Switch>
          </Router>
        </ThemeProvider>
      </AppContext.Provider>
    </>
  );
}

export default App;
