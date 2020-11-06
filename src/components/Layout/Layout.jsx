import React, { useState } from "react";

import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import LayoutRouter from "./LayoutRouter";
import NewPatient from "./newPatient";

import Fab from "@material-ui/core/Fab";

/* Styles */
import "./Layout.scss";

function Layout() {
  const [sidebarPos, setSidebarPos] = useState(1);
  const [newPatientModal, setNewPatientModal] = useState(false);

  const handleSidebar = () => {
    if (sidebarPos < 2) {
      setSidebarPos(sidebarPos + 1);
    } else {
      setSidebarPos(0);
    }
  };

  let sidebarClass = ["sidebar"];
  let mainClass = ["main"];
  if (sidebarPos === 1) {
    sidebarClass.push("sidebarMin");
    mainClass.push("mainMin");
  }
  if (sidebarPos === 2) {
    sidebarClass.push("sidebarOpen");
    mainClass.push("mainOpen");
  }

  return (
    <div className="layout">
      <Navbar onChange={handleSidebar} />
      <div className={sidebarClass.join(" ")}>
        <Sidebar />
      </div>
      <div className={mainClass.join(" ")}>
        <LayoutRouter />
      </div>
      <Fab
        className="newPatientBtn"
        color="primary"
        onClick={() => setNewPatientModal(true)}>
        <i className="material-icons">add</i>
      </Fab>
      <NewPatient
        open={newPatientModal}
        onClose={() => setNewPatientModal(false)}
      />
    </div>
  );
}

export default Layout;
