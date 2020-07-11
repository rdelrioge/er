import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Card, TextField, Button, CardHeader } from "@material-ui/core";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [authError, setAuthError] = useState(null);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    console.log("singup");
  };

  return (
    <Card className="card">
      <CardHeader title="Sign Up" className="cardheader" />
      <form onSubmit={handleSubmit}>
        <TextField
          required
          className="emailinput"
          fullWidth
          label="Email Address"
          variant="outlined"
          autoFocus
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          required
          className="passwordInput"
          fullWidth
          type="password"
          label="Password"
          variant="outlined"
          autoFocus
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          required
          className="firstNameInput"
          fullWidth
          label="First Name"
          variant="outlined"
          autoFocus
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          required
          className="lastNameInput"
          fullWidth
          label="Last Name"
          variant="outlined"
          autoFocus
          onChange={(e) => setLastName(e.target.value)}
        />
        {authError ? <p className="errormsg">{authError}</p> : null}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          round
          color="primary"
        >
          Sign Up
        </Button>
        <span>
          Already have an account?
          <Link size="small" className="linkto" to="/signin">
            Sign In
          </Link>
        </span>
      </form>
    </Card>
  );
}

export default SignUp;
