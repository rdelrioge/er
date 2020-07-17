import React, { useState, useEffect, useContext } from "react";

import "./PatientProfile.scss";

import { db } from "../../../index";
import { UserContext } from "../../../Store";

import PersonalData from "./PersonalData";
import ClinicalHistory from "./ClinicalHistory";
import Appointments from "./Appointments";

import { Paper, Button, IconButton } from "@material-ui/core";

function PatientProfile(props) {
  const patientID = props.match.params.uid;
  const [user] = useContext(UserContext);
  const patRef = db.collection("patients").doc(patientID);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [personalDataModal, setPersonalDataModal] = useState(false);
  const [clinicalHistoryModal, setClinicalHistoryModal] = useState(false);

  // READ FOR PATIENT DATA AND UPDATE COMPONENT
  useEffect(() => {
    let unsubscribe = db
      .collection("patients")
      .doc(patientID)
      .onSnapshot((snap) => {
        let pat = snap.data();
        setPatient(pat);
      });
    return unsubscribe;
  }, []);

  // READ PATIENT APPOINTMENTS
  useEffect(() => {
    let unsubscribe = db
      .collection("events")
      .where("patientid", "==", patientID)
      .onSnapshot((snap) => {
        let citas = [];
        snap.forEach((app) => {
          citas.push({ ...app.data(), uid: app.id });
        });
        setAppointments(citas);
      });
    return unsubscribe;
  }, []);

  return (
    <div className="patientProfile">
      {patient ? (
        <>
          <div className="superior">
            <div className="patient">
              <h1>
                {patient.name}
                <IconButton onClick={() => setPersonalDataModal(true)}>
                  <i className="material-icons">edit</i>
                </IconButton>
              </h1>
              <div className="patientData">
                <div className="left">
                  {patient.regid ? (
                    <span>
                      <b>Reg ID: </b>
                      {patient.regid}
                    </span>
                  ) : null}
                  {patient.age ? (
                    <span>
                      <b>Edad: </b>
                      {patient.age + " años"}
                    </span>
                  ) : null}
                  {patient.gender ? (
                    <span>
                      <b>Sexo: </b> {patient.gender}
                    </span>
                  ) : null}
                </div>
                <div className="right">
                  {patient.tel ? (
                    <span>
                      <b>Teléfono: </b>
                      {patient.tel}
                    </span>
                  ) : null}
                  {patient.email ? (
                    <span>
                      <b>e-mail: </b>
                      {patient.email}
                    </span>
                  ) : null}
                  {patient.address ? (
                    <span>
                      <b>Dirección: </b>
                      {patient.address}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="clinicalHistory">
              <div className="sectionHeader">
                <span>Historia Clínica</span>
                <IconButton onClick={() => setClinicalHistoryModal(true)}>
                  <i className="material-icons">edit</i>
                </IconButton>
              </div>
              <div className="sectionContent">
                <div className="superiorCH">
                  {patient.weight ? (
                    <span>
                      <b>Peso: </b>
                      {patient.weight + " Kgs"}
                    </span>
                  ) : null}
                  {patient.height ? (
                    <span>
                      <b>Estatura: </b>
                      {patient.height + " cms"}
                    </span>
                  ) : null}
                  {patient.bloodGroup ? (
                    <span>
                      <b>Tipo de sangre: </b> {patient.bloodGroup}
                    </span>
                  ) : null}
                </div>
                <div className="inferiorCH">
                  {patient.allergies ? (
                    <span>
                      <b>Alergias: </b>
                      {patient.allergies}
                    </span>
                  ) : null}
                  {patient.medications ? (
                    <span>
                      <b>Medicamentos: </b>
                      {patient.medications}
                    </span>
                  ) : null}
                  {patient.disorders ? (
                    <span>
                      <b>Enfermedades congénitas: </b> {patient.disorders}
                    </span>
                  ) : null}
                  {patient.notes ? (
                    <span>
                      <b>Notas: </b> {patient.notes}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <Paper className="inferior">
            <div className="appointments">
              {appointments.length > 0 ? (
                <Appointments appointments={appointments} user={user} />
              ) : (
                <div className="noappointments">
                  Agende una consulta para {patient.name}
                </div>
              )}
            </div>
          </Paper>
          {personalDataModal ? (
            <PersonalData
              patient={patient}
              patRef={patRef}
              user={user}
              open={personalDataModal}
              onClose={() => setPersonalDataModal(false)}
            />
          ) : null}
          {clinicalHistoryModal ? (
            <ClinicalHistory
              patient={patient}
              patRef={patRef}
              user={user}
              open={clinicalHistoryModal}
              onClose={() => setClinicalHistoryModal(false)}
            />
          ) : null}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default PatientProfile;
