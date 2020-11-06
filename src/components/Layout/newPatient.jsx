import React, { useState, useContext } from "react";
import moment from "moment";

import { UserContext } from "../../Store";

import {
  Button,
  TextField,
  Modal,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  OutlinedInput,
} from "@material-ui/core";
import {
  DatePicker,
  TimePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import Autocomplete from "@material-ui/lab/Autocomplete";

import MomentUtils from "@date-io/moment";

import Draggable from "react-draggable";

import "./newPatient.scss";
import { db } from "../../index";

const NewPatient = (props) => {
  const [user] = useContext(UserContext);
  const [regid, setRegId] = useState(Date.now().toString());
  const [firstname, setFirstName] = useState("");
  const [secondname, setSecondName] = useState("");
  const [lastname, setLastName] = useState("");
  const [seclastname, setSecLastName] = useState("");
  const [dob, setDOB] = useState(null);
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [numExt, setNumExt] = useState("");
  const [numInt, setNumInt] = useState("");
  const [county, setCounty] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState(null);
  const [diaCita, setDiaCita] = useState(null);
  const [horaCita, setHoraCita] = useState(null);
  const [sala, setSala] = useState(2);

  const estados = [
    "Aguascalientes",
    "Baja California",
    "Baja California Sur",
    "Campeche",
    "Chiapas",
    "Chihuahua",
    "Coahuila de Zaragoza",
    "Colima",
    "Ciudad de México",
    "Durango",
    "Estado de México",
    "Guanajuato",
    "Guerrero",
    "Hidalgo",
    "Jalisco",
    "Michoacan de Ocampo",
    "Morelos",
    "Nayarit",
    "Nuevo León",
    "Oaxaca",
    "Puebla",
    "Queretaro de Arteaga",
    "Quintana Roo",
    "San Luis Potosi",
    "Sinaloa",
    "Sonora",
    "Tabasco",
    "Tamaulipas",
    "Tlaxcala",
    "Veracruz",
    "Yucatan",
    "Zacatecas",
  ];
  const calcAge = (val) => {
    if (val) {
      console.log(val);
      setDOB(val);
      let dob = new Date(val);
      let today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      if (
        today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
      ) {
        age--;
      }
      setAge(age);
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (gender === "") {
      alert("ingrese el genero correctamente");
    } else {
      if (age) {
        let created = new Date();
        let name =
          firstname +
          (secondname ? ` ${secondname} ` : " ") +
          lastname +
          (seclastname ? ` ${seclastname}` : "");

        let mins = moment(horaCita).minutes();
        let hours = moment(horaCita).hours();
        let start = new Date(diaCita);
        start.setHours(hours);
        start.setMinutes(mins);
        let end = moment(start).add(30, "minutes").toDate();
        db.collection("patients")
          .add({
            regid,
            name,
            secondname,
            lastname,
            seclastname,
            dob: moment(dob).format("DD-MMM-YYYY"),
            age,
            gender,
            tel,
            email,
            direccion: {
              address,
              numExt,
              numInt,
              county,
              postalCode,
              city,
              state,
            },
            created: created.getTime(),
            owner: user,
          })
          .then((docRef) => {
            console.log("Doc written with ID: ", docRef.id);
            let newEvent = {
              title: name,
              start: start,
              startTS: moment(start).local().valueOf(),
              end: end,
              patientid: docRef.id,
              dia: moment(start).format("YYYY-MM-DD"),
              resourceId: sala,
            };
            console.log(newEvent);
            db.collection("events")
              .add(newEvent)
              .catch((err) => console.log("Error addign event: ", err));
          })
          .catch((err) => console.log("Error addign doc: ", err));
        props.onClose();
      } else {
        alert("Ingresa correctamente la fecha de nacimiento");
      }
    }
  };

  const handleClose = () => {
    props.onClose();
  };

  const resetProps = () => {
    db.collection("patients")
      .get()
      .then((pats) => {
        console.log(pats);
        let count = 1000 + pats.size;
        setRegId(count);
      });
    setFirstName("");
    setSecondName("");
    setLastName("");
    setSecLastName("");
    setDOB(null);
    setAge(null);
    setGender("");
    setTel("");
    setEmail("");
    setAddress("");
    setNumExt("");
    setNumInt("");
    setCounty("");
    setPostalCode("");
    setCity("");
    setState(null);
    setDiaCita(null);
    setHoraCita(null);
    setSala(2);
  };

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      // aria-labelledby="form-dialog-name"
      onRendered={resetProps}>
      <Draggable handle="strong">
        <div className="newPatientModal">
          <strong>
            <h3 id="form-dialog-name"> Nuevo Paciente </h3>
          </strong>
          <form onSubmit={handleSubmit} className="contentNewPatientModal">
            <div className="superiorData">
              <TextField
                label="ID de registro"
                variant="outlined"
                size="small"
                required
                InputProps={{
                  readOnly: true,
                }}
                value={regid}
              />
              <span></span>
              <span></span>
              <span></span>
              <TextField
                label="Nombre"
                variant="outlined"
                required
                size="small"
                autoFocus
                value={firstname}
                onChange={(e) =>
                  setFirstName(
                    e.target.value
                      .replace(/\b\w/g, (l) => l.toUpperCase())
                      .trim()
                  )
                }
              />
              <TextField
                label="Segundo Nombre"
                variant="outlined"
                size="small"
                value={secondname}
                onChange={(e) =>
                  setSecondName(
                    e.target.value
                      .replace(/\b\w/g, (l) => l.toUpperCase())
                      .trim()
                  )
                }
              />
              <TextField
                label="Apellido paterno"
                variant="outlined"
                size="small"
                required
                value={lastname}
                onChange={(e) =>
                  setLastName(
                    e.target.value.replace(/\b\w/g, (l) => l.toUpperCase())
                  )
                }
              />
              <TextField
                label="Apellido materno"
                variant="outlined"
                size="small"
                value={seclastname}
                onChange={(e) =>
                  setSecLastName(
                    e.target.value.replace(/\b\w/g, (l) => l.toUpperCase())
                  )
                }
              />
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker
                  inputVariant="outlined"
                  label="Fecha de nacimiento"
                  format="DD/MM/yyyy"
                  size="small"
                  required
                  helperText="dd/mm/yyyy"
                  value={dob}
                  onChange={calcAge}
                />
              </MuiPickersUtilsProvider>
              <p>
                {age ? (
                  <>
                    <b>Edad:</b> {age} años
                  </>
                ) : null}
              </p>
              <FormControl
                className="selectGender"
                size="small"
                variant="outlined">
                <InputLabel htmlFor="gender">Género *</InputLabel>
                <Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  input={
                    <OutlinedInput labelWidth={50} name="gender" id="gender" />
                  }>
                  <MenuItem value="M">Masculino</MenuItem>
                  <MenuItem value="F">Femenino</MenuItem>
                </Select>
              </FormControl>
              <span></span>
            </div>
            <div className="inferiorData">
              <div className="infDataRow1">
                <TextField
                  label="Teléfono"
                  variant="outlined"
                  size="small"
                  required
                  value={tel}
                  onChange={(e) => setTel(e.target.value.trim())}
                />
                <TextField
                  label="Dirección"
                  variant="outlined"
                  size="small"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <TextField
                  label="No. Ext"
                  variant="outlined"
                  size="small"
                  value={numExt}
                  onChange={(e) => setNumExt(e.target.value)}
                />
                <TextField
                  label="No. Int"
                  variant="outlined"
                  size="small"
                  value={numInt}
                  onChange={(e) => setNumInt(e.target.value)}
                />
              </div>
              <div className="infDataRow2">
                <TextField
                  label="e-mail"
                  variant="outlined"
                  size="small"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                />
                <TextField
                  label="Colonia"
                  variant="outlined"
                  size="small"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                />
                <TextField
                  label="C.P."
                  variant="outlined"
                  size="small"
                  type="tel"
                  inputProps={{
                    maxLength: 5,
                  }}
                  value={postalCode}
                  onChange={(e) =>
                    setPostalCode(e.target.value.replace(/[^\d]/, "").trim())
                  }
                />
                <TextField
                  label="Ciudad"
                  variant="outlined"
                  size="small"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Autocomplete
                  id="combo-box-states"
                  options={estados}
                  value={state}
                  onChange={(ev, val) => setState(val)}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Estado"
                      size="small"
                      variant="outlined"
                    />
                  )}
                />
              </div>
            </div>
            <div className="agendarPaciente">
              <h4>Programar cita:</h4>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  autoOk
                  inputVariant="outlined"
                  label="Dia"
                  size="small"
                  value={diaCita}
                  onChange={setDiaCita}
                />
                <TimePicker
                  inputVariant="outlined"
                  label="Hora"
                  value={horaCita}
                  size="small"
                  onChange={setHoraCita}
                  minutesStep="5"
                />
              </MuiPickersUtilsProvider>
              <FormControl
                className="selectSala"
                size="small"
                variant="outlined">
                <InputLabel htmlFor="sala">Sala</InputLabel>
                <Select
                  value={sala}
                  onChange={(e) => setSala(e.target.value)}
                  input={<OutlinedInput labelWidth={30} id="sala" />}>
                  <MenuItem value={1}>Tomografía</MenuItem>
                  <MenuItem value={2}>Rayos X</MenuItem>
                  <MenuItem value={3}>Ultrasonido</MenuItem>
                  <MenuItem value={4}>Mastografía</MenuItem>
                </Select>
              </FormControl>
            </div>
            <Button
              className="addBtn"
              type="submit"
              variant="contained"
              color="primary">
              Agregar
            </Button>
          </form>
        </div>
      </Draggable>
    </Modal>
  );
};

export default NewPatient;
