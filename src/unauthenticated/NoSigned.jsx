import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
// Import Components
import SignIn from "./SignIn";
import SignUp from "./SignUp";
// Import SCSS files
import variables from "../index.scss";
import "./NoSigned.scss";

function NoSigned() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className="signlayout">
        <h1>EMR</h1>
        <BrowserRouter>
          <Switch>
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/signup" component={SignUp} />
            <Route path="*" render={() => <Redirect to="/signin" />} />
          </Switch>
        </BrowserRouter>
        <footer>Version 1.0.0</footer>
      </div>
    </MuiThemeProvider>
  );
}

// Theme config
const theme = createMuiTheme({
  palette: {
    primary: { main: variables.primary, contrastText: "#ffffff" },
    secondary: { main: variables.secondary },
  },
  typography: { useNextVariants: true },
});

export default NoSigned;
