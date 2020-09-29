import React, { useState, useContext } from "react";

import { UserContext } from "../../Store";

import { Button, TextField, Modal } from "@material-ui/core";

import Draggable from "react-draggable";

import { db } from "../../index";

const NewPatient = (props) => {
  const [user] = useContext(UserContext);
  const [firstname, setFirstName] = useState("");
  const [secondname, setSecondName] = useState("");
  const [lastname, setLastName] = useState("");
  const [seclastname, setSecLastName] = useState("");
  const [regid, setRegId] = useState(Date.now().toString());
  const [tel, setTel] = useState("");

  const handleSubmit = (ev) => {
    let created = new Date();
    let name =
      firstname +
      (secondname ? ` ${secondname} ` : " ") +
      lastname +
      (seclastname ? ` ${seclastname}` : "");
    console.log(name);
    ev.preventDefault();
    db.collection("patients")
      .add({
        name,
        secondname,
        lastname,
        seclastname,
        regid,
        tel,
        created: created.getTime(),
        owner: user,
      })
      .then((docRef) => console.log("Doc written with ID: ", docRef.id))
      .catch((err) => console.log("Error addign doc: ", err));
    props.onClose();
  };

  const handleClose = () => {
    props.onClose();
  };

  const resetProps = () => {
    setFirstName("");
    setSecondName("");
    setLastName("");
    setSecLastName("");
    setRegId(Date.now());
    setTel("");
  };

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-name"
      onRendered={resetProps}
    >
      <Draggable handle=".header">
        <div className="newPatientModal">
          <div className="header">
            <h3 id="form-dialog-name"> New Patient </h3>
          </div>
          <form onSubmit={handleSubmit} className="contentNewPatientModal">
            <TextField
              label="Nombre"
              variant="outlined"
              required
              autoFocus
              value={firstname}
              onChange={(e) => setFirstName(e.target.value.trim())}
            />
            <TextField
              label="Segundo Nombre"
              variant="outlined"
              value={secondname}
              onChange={(e) => setSecondName(e.target.value.trim())}
            />
            <TextField
              label="Apellido paterno"
              variant="outlined"
              required
              value={lastname}
              onChange={(e) => setLastName(e.target.value.trim())}
            />
            <TextField
              label="Apellido materno"
              variant="outlined"
              value={seclastname}
              onChange={(e) => setSecLastName(e.target.value.trim())}
            />
            <TextField
              label="ID de registro"
              variant="outlined"
              required
              value={regid}
              onChange={(e) => setRegId(e.target.value.trim())}
            />
            <TextField
              label="Teléfono"
              variant="outlined"
              required
              value={tel}
              onChange={(e) => setTel(e.target.value.trim())}
            />
            <span></span>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Add patient
            </Button>
          </form>
        </div>
      </Draggable>
    </Modal>
  );
};

export default NewPatient;
