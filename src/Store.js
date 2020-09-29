import React, { useState, useEffect } from "react";
import { fb, db } from "./index";

export const UserContext = React.createContext();
export const PatientsContext = React.createContext();

const Store = ({ children }) => {
  const [user, setUser] = useState(fb.auth().currentUser.displayName);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    console.log("pats from Store");
    console.log(patients);
  }, [patients]);

  // READ FOR PATIENTS IN DB USING GET()
  // useEffect(() => {
  //   db.collection("patients")
  //     .get()
  //     // .get({ source: "cache" })
  //     .then((data) => {
  //       let myPatients = [];
  //       data.forEach((patient) => {
  //         let pat = { ...patient.data(), uid: patient.id };
  //         myPatients.push(pat);
  //       });
  //       setPatients(myPatients);
  //       console.log("Read patients from DB");
  //     });
  // }, []);

  // READ FOR PATIENTS IN DB USING ONSNAPSHOT()
  useEffect(() => {
    db.collection("patients").onSnapshot(
      { includeMetadataChanges: true },
      (data) => {
        let myPatients = [];
        data.forEach((patient) => {
          console.log(patient);
          let pat = { ...patient.data(), uid: patient.id };
          myPatients.push(pat);
        });
        setPatients(myPatients);
        console.log("Read patients from DB");
        console.log(data);
        data.docChanges().forEach((change) => {
          if (change.type === "modified") {
            console.log("Modified city: ", change.doc.data());
          }
        });
      }
    );
  }, []);

  // db.collection("patients").onSnapshot((snap) => {
  //   console.log("onSnapStore");
  //   let myPatients = [];
  //   snap.docChanges().forEach((patient) => {
  //     console.log(patient.doc.data());
  //     let pat = { ...patient.doc.data(), uid: patient.doc.id };
  //     myPatients.push(pat);
  //   });
  //   setPatients(myPatients);
  // });

  return (
    <UserContext.Provider value={[user, setUser]}>
      <PatientsContext.Provider value={[patients, setPatients]}>
        {children}
      </PatientsContext.Provider>
    </UserContext.Provider>
  );
};

export default Store;
