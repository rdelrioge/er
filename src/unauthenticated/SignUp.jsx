import React, { useState } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/app";

import { Card, TextField, Button, CardHeader } from "@material-ui/core";
import { db } from "../index";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [authError, setAuthError] = useState(null);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {
        setAuthError(null);
        console.log(data);
        data.user
          .updateProfile({
            displayName: firstName + " " + lastName,
            photoURL: null,
          })
          .then(() => {
            const myNewUser = {
              uid: data.user.uid,
              email: data.user.email,
              displayName: data.user.displayName,
              photoURL: data.user.photoURL,
              password: password,
              lastlogin: data.user.metadata.lastSignInTime,
              created: data.user.metadata.creationTime,
            };
            db.collection("users")
              .add(myNewUser)
              .then((docRef) => console.log("Doc written with ID: ", docRef.id))
              .catch((err) => console.log("Error addign doc: ", err));
          });
      })
      .catch((err) => {
        setAuthError(err.message);
      });
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
