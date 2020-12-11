import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import {
  Button,
  FormControl,
  Input,
  InputLabel,
  IconButton,
  Stepper,
  Select,
  Dialog,
  Step,
  StepLabel,
  MenuItem,
  OutlinedInput,
  Zoom,
} from "@material-ui/core";

import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import MomentUtils from "@date-io/moment";

import Draggable from "react-draggable";
import { PatientsContext } from "../../Store";

const Event = (props) => {
  const [patient, setPatient] = useState({});
  const [delbtn, setDelBtn] = useState(props.delbtn);
  const [ready, setReady] = useState(props.ready);
  const [open, setOpen] = useState(props.open);
  const [remove, setRemove] = useState(props.remove);
  const [start, setStart] = useState(props.event.start);
  const [end, setEnd] = useState(props.event.end);
  const [resourceId, setResourceId] = useState(1);
  const [patients] = useContext(PatientsContext);
  const [results, setResults] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Buscar", "Agendar"];

  useEffect(() => {
    if (ready === true) {
      props.onClose({ start, end, ready, remove, patient, resourceId });
    }
  }, [ready]);

  useEffect(() => {
    if (remove === true) {
      props.onClose({ start, end, ready, remove, patient, resourceId });
    }
  }, [remove]);

  useEffect(() => {
    if (open === false) {
      props.onClose({ start, end, ready, remove, patient, resourceId });
    }
  }, [open]);

  const mapPropsToState = () => {
    if (props.delbtn) {
      patients.forEach((pat) => {
        let res = pat.uid.localeCompare(props.event.patientid);
        if (res === 0) {
          setPatient(pat);
          console.log(pat);
        }
      });
    }
    setDelBtn(props.delbtn);
    setReady(props.ready);
    setOpen(props.open);
    setRemove(props.remove);
    setStart(props.event.start);
    setEnd(props.event.end);
    props.event.resourceId
      ? setResourceId(props.event.resourceId)
      : setResourceId(1);
  };

  const handleTimeChange = (date, time) => {
    let mins = moment(date).minutes();
    let hours = moment(date).hours();
    if (time === "start") {
      let newDate = new Date(start);
      newDate.setHours(hours);
      newDate.setMinutes(mins);
      setStart(newDate);
    }
    if (time === "end") {
      let newDate = new Date(end);
      newDate.setHours(hours);
      newDate.setMinutes(mins);
      setEnd(newDate);
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setReady(true);
  };
  const handleRemove = () => {
    const r = window.confirm(
      "¿Estás seguro que deseas eliminar esta cita de la agenda?"
    );
    if (r === true) {
      setRemove(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  // FIlter
  const filterPatients = (val) => {
    val = val.trim().toLowerCase();
    if (val === "") {
      setResults([]);
    } else {
      setResults(filterAllProperties([...patients], val));
    }
  };

  const filterAllProperties = (array, value) => {
    let filtrado = [];
    for (let i = 0; i < array.length; i++) {
      let obj = JSON.stringify(array[i]);
      if (obj.toLowerCase().indexOf(value) >= 0) {
        filtrado.push(JSON.parse(obj));
      }
    }
    return filtrado;
  };

  const selectPatient = (pat) => {
    setPatient(pat);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Stepper
  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <div className="case0">
            <FormControl
              className="titleinput"
              margin="normal"
              required
              fullWidth>
              <InputLabel htmlFor="title">Buscar paciente</InputLabel>
              <Input
                id="title"
                name="title"
                autoComplete="title"
                autoFocus
                onChange={(e) => filterPatients(e.target.value)}
              />
            </FormControl>
            <ul className="patientList">
              {results.length > 0 ? (
                <div>
                  {results.map((patient, index) => {
                    return (
                      <li
                        key={index}
                        className={index % 2 ? "even" : "odd"}
                        onClick={() => selectPatient(patient)}>
                        <span> {patient.name} </span>
                        <span> {patient.tel} </span>
                      </li>
                    );
                  })}
                </div>
              ) : null}
            </ul>
          </div>
        );
      case 1:
        return (
          <div className="case1">
            {delbtn ? (
              <Link to={{ pathname: `/patient/${patient.uid}` }}>
                <h3>{props.event.title}</h3>
              </Link>
            ) : (
              <div className="newSelected">
                <IconButton
                  // variant="contained"
                  onClick={handleBack}>
                  <i className="material-icons">arrow_back</i>
                </IconButton>
                <h3>{patient.name}</h3>
              </div>
            )}
            <div className="pickers">
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <TimePicker
                  className="timepicker"
                  inputVariant="outlined"
                  size="small"
                  label="Inicio"
                  minutesStep="5"
                  value={start}
                  onChange={(date) => handleTimeChange(date, "start")}
                />
                <TimePicker
                  className="timepicker"
                  inputVariant="outlined"
                  size="small"
                  minutesStep="5"
                  label="Fin"
                  value={end}
                  onChange={(date) => handleTimeChange(date, "end")}
                />
              </MuiPickersUtilsProvider>
            </div>
            <FormControl
              className="selectSala"
              size="small"
              variant="outlined"
              fullWidth>
              <InputLabel htmlFor="sala">Sala</InputLabel>
              <Select
                defaultValue={
                  props.event.resourceId ? props.event.resourceId : resourceId
                }
                value={resourceId}
                onChange={(e) => setResourceId(e.target.value)}
                input={<OutlinedInput labelWidth={30} id="sala" />}>
                <MenuItem value={1}>Tomografía</MenuItem>
                <MenuItem value={2}>Rayos X</MenuItem>
                <MenuItem value={3}>Ultrasonido</MenuItem>
                <MenuItem value={4}>Mastografía</MenuItem>
              </Select>
            </FormControl>
          </div>
        );
      default:
        return "Uknown stepIndex";
    }
  }

  function handleBack() {
    setResults([]);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      disableAutoFocus={delbtn}
      onRendered={mapPropsToState}
      TransitionComponent={Zoom}>
      <Draggable handle=".header">
        <div className="eventModal">
          <div className="header">
            <h2 id="form-dialog-title"> {props.title} </h2>
            {delbtn ? (
              <IconButton onClick={handleRemove}>
                <i className="material-icons">delete</i>
              </IconButton>
            ) : (
              <div />
            )}
          </div>
          {delbtn ? (
            <div className="editContent">
              {getStepContent(1)}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}>
                Guardar
              </Button>
            </div>
          ) : (
            <div className="newContent">
              {getStepContent(activeStep)}
              {activeStep === 0 ? (
                <div />
              ) : (
                <div className="btns">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    fullWidth>
                    Guardar
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Draggable>
    </Dialog>
  );
};

export default Event;
