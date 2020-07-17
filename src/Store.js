import React, { useState, useEffect } from "react";
import { fb, db } from "./index";

export const UserContext = React.createContext();
export const PatientsContext = React.createContext();

const Store = ({ children }) => {
  const [user, setUser] = useState(fb.auth().currentUser.displayName);
  const [patients, setPatients] = useState([]);

  // READ FOR PATIENTS IN DB
  useEffect(() => {
    db.collection("patients")
      .get()
      .then((data) => {
        let myPatients = [];
        data.forEach((patient) => {
          let pat = { ...patient.data(), uid: patient.id };
          myPatients.push(pat);
        });
        setPatients(myPatients);
        console.log("Read patients from DB");
      });
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <PatientsContext.Provider value={[patients, setPatients]}>
        {children}
      </PatientsContext.Provider>
    </UserContext.Provider>
  );
};

export default Store;
