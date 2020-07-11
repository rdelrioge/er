import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, TextField, Button, CardHeader } from "@material-ui/core";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    console.log("Signin");
  };

  return (
    <Card className="card">
      <CardHeader title="Sign In" className="cardheader" />
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
        {authError ? <p className="errormsg">{authError}</p> : null}
        <Button type="submit" fullWidth variant="contained" color="primary">
          Sign in
        </Button>
        <span>
          New User?
          <Link size="small" className="linkto" to="/signup">
            Register
          </Link>
        </span>
      </form>
    </Card>
  );
}

export default SignIn;
