import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  TextField,
  InputLabel,
  OutlinedInput,
  MenuItem,
  FormControl,
  Select,
  Paper,
} from "@material-ui/core";

import "./Patients.scss";
import { db } from "../..";

const Pacientes = () => {
  const [results, setResults] = useState([]);
  const [limite, setLimite] = useState(5);
  const [filtroBuscar, setFiltroBuscar] = useState("name");

  const filterPatients = (val) => {
    if (val === "") {
      setResults([]);
    } else {
      if (filtroBuscar === "regid" || filtroBuscar === "tel") {
        // Si filtro es regid o tel, empieza a buscar cuando sean mas de 6 digitos
        if (val.length === 6) {
          let myPatients = [];
          db.collection("patients")
            .where(filtroBuscar, ">=", val)
            .where(filtroBuscar, "<=", val + "\uf8ff")
            .limit(limite)
            .get()
            .then((docs) => {
              docs.forEach((patient) => {
                let pat = { ...patient.data(), uid: patient.id };
                myPatients.push(pat);
              });
              console.log(`From ${filtroBuscar} on FS:`);
              console.log(myPatients);
              setResults(myPatients);
            });
        }
        if (val.length > 6 && results.length > 0) {
          setResults(filterByProperty([...results], filtroBuscar, val));
        }
      } else {
        // Si no es regid ni tel entonces busca a partir del 3 digito ingresado
        if (val.length === 3) {
          let myPatients = [];
          // buscar pacientes por nombre
          db.collection("patients")
            .where(filtroBuscar, ">=", val)
            .where(filtroBuscar, "<=", val + "\uf8ff")
            .limit(limite)
            .get()
            .then((docs) => {
              docs.forEach((patient) => {
                let pat = { ...patient.data(), uid: patient.id };
                myPatients.push(pat);
              });
              console.log(`From ${filtroBuscar} on FS:`);
              console.log(myPatients);
              setResults(myPatients);
            });
          db.collection("patients")
            .where("secondname", ">=", val)
            .where("secondname", "<=", val + "\uf8ff")
            .limit(limite)
            .get()
            .then((docs) => {
              docs.forEach((patient) => {
                let pat = { ...patient.data(), uid: patient.id };
                myPatients.push(pat);
              });
              console.log("From secondname on FS:");
              console.log(myPatients);
              setResults(myPatients);
            });
          db.collection("patients")
            .where("lastname", ">=", val)
            .where("lastname", "<=", val + "\uf8ff")
            .limit(limite)
            .get()
            .then((docs) => {
              docs.forEach((patient) => {
                let pat = { ...patient.data(), uid: patient.id };
                myPatients.push(pat);
              });
              console.log("From lastname on FS:");
              console.log(myPatients);
              setResults(myPatients);
            });
          db.collection("patients")
            .where("seclastname", ">=", val)
            .where("seclastname", "<=", val + "\uf8ff")
            .limit(limite)
            .get()
            .then((docs) => {
              docs.forEach((patient) => {
                let pat = { ...patient.data(), uid: patient.id };
                myPatients.push(pat);
              });
              console.log("From seclastname on FS:");
              console.log(myPatients);
              setResults(myPatients);
            });
        }
        if (val.length > 3 && results.length > 0) {
          setResults(filterByProperty([...results], "name", val));
        }
      }
    }
  };

  const filterByProperty = (array, prop, value) => {
    var filtered = [];
    for (var i = 0; i < array.length; i++) {
      var obj = array[i];
      if (obj[prop].indexOf(value) >= 0) {
        filtered.push(obj);
      }
    }
    return filtered;
  };

  return (
    <div className="pacientes">
      <div className="superior">
        <h1>Pacientes</h1>
      </div>
      <Paper className="paperSearch">
        <FormControl size="small" className="filtroBuscar" variant="outlined">
          <InputLabel htmlFor="filtroBuscar">Buscar por</InputLabel>
          <Select
            value={filtroBuscar}
            onChange={(e) => setFiltroBuscar(e.target.value)}
            input={
              <OutlinedInput
                labelWidth={80}
                size="small"
                name="filtroBuscar"
                id="filtroBuscar"
              />
            }>
            <MenuItem value="name">Nombre(s)</MenuItem>
            <MenuItem value="regid">No de registro</MenuItem>
            <MenuItem value="tel">Teléfono</MenuItem>
          </Select>
        </FormControl>
        <TextField
          className="searchInput"
          type="search"
          label="Buscar paciente"
          variant="outlined"
          autoFocus
          size="small"
          helperText={
            filtroBuscar === "name"
              ? "Ingresar mínimo 3 digitos del(os) nombre(s) o apellido(s)"
              : filtroBuscar === "tel"
              ? "Ingresar mínimo 6 digitos del telefono"
              : filtroBuscar === "regid"
              ? "Ingresar mínimo 6 digitos del ID"
              : null
          }
          onChange={(e) =>
            filterPatients(
              e.target.value.replace(/\b\w/g, (l) => l.toUpperCase())
            )
          }
        />
      </Paper>
      <Paper className="paperPatientsList">
        <ul>
          {results.length > 0 ? (
            <>
              <div className="gridHead">
                <h3>RegId</h3>
                <h3>Nombre</h3>
                <h3>Teléfono</h3>
              </div>
              {results.map((patient, index) => {
                return (
                  <li key={index} className={index % 2 ? "odd" : "even"}>
                    <Link
                      to={{ pathname: `/patient/${patient.uid}` }}
                      className="gridBody">
                      <span> {patient.regid} </span>
                      <span> {patient.name} </span>
                      <span> {patient.tel} </span>
                    </Link>
                  </li>
                );
              })}
            </>
          ) : (
            <span> Busca un paciente o crea uno nuevo </span>
          )}
        </ul>
      </Paper>
    </div>
  );
};

export default Pacientes;
