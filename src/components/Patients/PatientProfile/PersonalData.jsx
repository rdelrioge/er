import React, { useState, useEffect } from "react";
import moment from "moment";

// Material
import {
  TextField,
  InputLabel,
  OutlinedInput,
  MenuItem,
  FormControl,
  Select,
  DialogTitle,
  DialogContent,
  Button,
  Dialog,
  Zoom,
  Slide,
} from "@material-ui/core";

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import MomentUtils from "@date-io/moment";

import Draggable from "react-draggable";

function PersonalData(props) {
  const [patient, setPatient] = useState(props.patient);
  const [mydate, setMyDate] = useState(null);

  useEffect(() => {
    setPatient(props.patient);
    if (props.patient.dob !== null) setMyDate(props.patient.dob);
    console.log(props.patient);
  }, [props]);

  const handlePersonalData = () => {
    if (mydate) {
      let dob = new Date(mydate);
      let today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      if (
        today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
      ) {
        age--;
      }
      // let offset = dob.getTimezoneOffset();
      // let dobFl = dob.getTime() + offset * 60 * 1000;
      // let correct = new Date(dobFl);
      props.patRef.update({
        ...patient,
        dob: moment(dob).format("DD-MMM-YYYY"),
        age,
        edited: new Date(),
        editedBy: props.user,
      });
    } else {
      props.patRef.update({
        ...patient,
        edited: new Date(),
        editedBy: props.user,
      });
    }
    handleClose();
  };

  const renderDate = () => {
    let fbdate = patient.dob.toDate();
    let day = ("0" + fbdate.getDate()).slice(-2);
    let month = ("0" + (fbdate.getMonth() + 1)).slice(-2);
    return fbdate.getFullYear() + "-" + month + "-" + day;
  };

  const handleClose = () => {
    props.onClose();
  };

  const parseDate = (ev) => {
    console.log(ev);
    setMyDate(ev);
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-name"
      TransitionComponent={Slide}
      TransitionProps={{ direction: "down" }}
      // onRendered={resetProps}
    >
      <Draggable handle=".header">
        <div className="personalDataModal">
          <div className="header">
            <DialogTitle id="form-dialog-name">
              Patient Data
              <Button
                variant="contained"
                color="primary"
                onClick={handlePersonalData}>
                Guardar
              </Button>
            </DialogTitle>
          </div>
          <DialogContent className="sectionContent">
            <TextField
              label="Nombre"
              variant="outlined"
              autoFocus
              value={patient.name ? patient.name : ""}
              onChange={(e) => setPatient({ ...patient, name: e.target.value })}
            />
            <TextField
              label="Teléfono"
              variant="outlined"
              value={patient.tel ? patient.tel : ""}
              onChange={(e) => setPatient({ ...patient, tel: e.target.value })}
            />
            <TextField
              label="e-mail"
              variant="outlined"
              value={patient.email ? patient.email : ""}
              onChange={(e) =>
                setPatient({ ...patient, email: e.target.value })
              }
            />
            <TextField
              className="address"
              label="Dirección"
              variant="outlined"
              multiline
              rows="3"
              value={patient.address ? patient.address : ""}
              onChange={(e) =>
                setPatient({ ...patient, address: e.target.value })
              }
            />
            <FormControl className="selectGender" variant="outlined">
              <InputLabel htmlFor="gender">Género</InputLabel>
              <Select
                value={patient.gender ? patient.gender : ""}
                onChange={(e) =>
                  setPatient({ ...patient, gender: e.target.value })
                }
                input={
                  <OutlinedInput labelWidth={50} name="gender" id="gender" />
                }>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="M">Masculino</MenuItem>
                <MenuItem value="F">Femenino</MenuItem>
                {/* <MenuItem value="Otro">Other</MenuItem> */}
              </Select>
            </FormControl>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                className="dob"
                label="Fecha de nacimiento"
                inputVariant="outlined"
                format="DD/MM/YYYY"
                helperText="dd/mm/yyyy"
                size="small"
                defaultValue={patient.dob ? patient.dob : null}
                value={mydate}
                onChange={(ev) => parseDate(ev)}
              />
            </MuiPickersUtilsProvider>
          </DialogContent>
        </div>
      </Draggable>
    </Dialog>
  );
}

export default PersonalData;
